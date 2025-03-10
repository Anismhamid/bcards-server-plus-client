const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../models/User");
const {genSalt, hash, compare} = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middlewares/auth");

// Joi Schema for user registration
const userRegisterJoiSchema = Joi.object({
	name: Joi.object({
		first: Joi.string().min(2).required(),
		middle: Joi.string().allow(""),
		last: Joi.string().min(1).required(),
	}),
	isBusiness: Joi.boolean().required(),
	isAdmin: Joi.boolean(),
	phone: Joi.string()
		.required()
		.min(9)
		.max(10)
		.pattern(/^05\d{8,9}$/)
		.message(
			"The phone number must be an Israeli phone number starting with 05 and max digits is 9-10 ",
		),
	email: Joi.string().email().min(2).required(),
	password: Joi.string()
		.min(8)
		.max(20)
		.required()
		.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=-_])/)
		.message(
			"Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
		),
	address: Joi.object({
		state: Joi.string().min(2).allow(""),
		country: Joi.string().min(2).required(),
		city: Joi.string().min(2).required(),
		street: Joi.string().min(2).required(),
		houseNumber: Joi.number().required(),
		zip: Joi.number().required(),
	}),
	image: Joi.object({
		url: Joi.string()
			.default(
				"https://images.unsplash.com/photo-1740418644050-7c315b61bbff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
			)
			.allow("")
			.optional(),
		alt: Joi.string().default("profile").allow("").optional(),
	}).optional(),
});

// user registeration
router.post("/", async (req, res) => {
	try {
		// check body validation
		const {error} = userRegisterJoiSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// check if user exist
		const userExist = await User.findOne({email: req.body.email});

		// if user exist create error with c.log red color chalk
		if (userExist) {
			console.log(chalk.red("Invalid email or password"));
			return res.status(400).send("Invalid email or password");
		}

		// if user not exist salt the password
		const salt = await genSalt(10);

		// hash the password
		const passwordHashing = await hash(req.body.password, salt);

		// create new user
		const user = new User({
			...req.body,
			password: passwordHashing,
		});

		// save the user on database
		await user.save();

		// c.log is registered
		console.log(
			chalk.yellowBright(res.status(200), "user has been registered successfully"),
		);
		res.status(200).send("user has been registered successfully");
	} catch (error) {
		res.status(400).send(error);
	}
});

// user login schema
const loginSchema = Joi.object({
	email: Joi.string().email().min(2).required(),
	password: Joi.string()
		.min(6)
		.required()
		.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/)
		.message(
			"Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
		),
});

// user login
router.post("/login", async (req, res) => {
	try {
		// validate login body
		const {error} = loginSchema.validate(req.body);
		if (error) return res.status(400).send("Invalid email or password");

		// check if user exist
		const user = await User.findOne({email: req.body.email});

		// if user not exixst
		if (!user) {
			console.log(chalk.red("wrong email or password"));
			return res.status(404).send("wrong email or password");
		}
		//if user found compare the password
		userPassword = await compare(req.body.password, user.password);

		// if the password is invalid
		if (!userPassword) {
			console.log(chalk.red("invalid email or password"));
			return res.status(400).send("invalid email or password");
		}

		// set token and send it to user
		const token = jwt.sign(
			_.pick(user, [
				"_id",
				"name.first",
				"name.last",
				"email",
				"isAdmin",
				"isBusiness",
			]),
			process.env.JWT_SECRET,
		);
		res.status(200).send(token);
	} catch (error) {
		// if the login has any error
		console.log(chalk.red("An error occurred during login"), error);
		res.status(400).send(error);
	}
});

// get all users for admin users
router.get("/", auth, async (req, res) => {
	try {
		if (req.payload.isAdmin === true)
			return res.status(403).send("just admin user can access");
		const users = await User.find().select("-password");
		if (!users) return res.status(401).send("no found users");

		res.status(200).send(users);
	} catch (error) {
		console.log(chalk.red(error.message));
		res.status(400).send(error);
	}
});

// get information for The registered user or admin users
router.get("/:id", auth, async (req, res) => {
	try {
		// Check if the user is an admin or if the user is accessing their own data
		if (req.payload.isAdmin || req.payload._id === req.params.id) {
			// Fetch user by ID
			const user = await User.findById(req.params.id).select("-password");
			if (!user) return res.status(404).send("User not found");

			// Send the user data with status 200
			return res.status(200).send(user);
		} else {
			return res
				.status(401)
				.send("Access denied. You are not authorized to access this user's data");
		}
	} catch (error) {
		return res.status(400).send(error);
	}
});

module.exports = router;
