const express = require("express");
const router = express.Router();
const User = require("../models/User");
const SpscripeForNews = require("../models/SubscripeForNews");
const {genSalt, hash, compare} = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const {
	userRegisterJoiSchema,
	loginSchema,
	subscripeForNews,
	userUpdateJoiSchema,
} = require("../schemas/userSchema");

// user registeration
router.post("/", async (req, res) => {
	try {
		// check body validation
		const {error} = userRegisterJoiSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// check if user exist
		const userExist = await User.findOne({email: req.body.email});
		if (userExist) {
			console.log(chalk.red("User already exists try another email"));
			return res.status(400).send("User already exists try another email");
		}

		// if user not exist salt the password
		const salt = await genSalt(10);

		// hash the password
		const passwordHashing = await hash(req.body.password, salt);

		// create a new user
		const user = new User({
			...req.body,
			registryStamp: new Date().toLocaleString(),
			password: passwordHashing,
		});

		const token = jwt.sign(
			_.pick(user, ["_id", "isAdmin", "isBusiness"]),
			process.env.JWT_SECRET,
		);

		// save the user on database
		await user.save();

		// c.log is registered
		console.log(chalk.yellowBright("user has been registered successfully"));
		res.status(200).send(token);
	} catch (error) {
		res.status(400).send(error);
	}
});

// user login
router.post("/login", async (req, res) => {
	try {
		// validate login body
		const {error} = loginSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// check if user exist
		const user = await User.findOne({email: req.body.email});

		// if user not exixst
		if (!user) {
			console.log(chalk.red("invalid email or password please try again"));
			return res.status(400).send("invalid email or password please try again");
		}
		//if user found compare the password
		const userPassword = await compare(req.body.password, user.password);

		// if the password is invalid
		if (!userPassword) {
			console.log(chalk.red("invalid email or password please try again"));
			return res.status(400).send("invalid email or password please try again");
		}

		user.loginStamp.push(new Date().toLocaleString());
		await user.save();

		// set token and send it to user
		const token = jwt.sign(
			_.pick(user, ["_id", "name.first", "name.last", "isAdmin", "isBusiness"]),
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
		// check if user is admin
		if (!req.payload.isAdmin)
			return res.status(403).send("just admin user can access");

		// find user
		const users = await User.find().select("-password");
		if (!users) return res.status(404).send("no users found ");

		// return the user
		res.status(200).send(users);
	} catch (error) {
		console.log(chalk.red(error.message));
		res.status(400).send(error);
	}
});

// get information for The registered user
router.get("/profile/:id", auth, async (req, res) => {
	try {
		// Check if the user is an admin or if the user is accessing their own data
		if (req.payload._id !== req.params.id && !req.payload.isAdmin)
			return res
				.status(401)
				.send("Access denied. You are not authorized to access this user's data");

		// Fetch user by ID
		const user = await User.findById(req.params.id,{password:0})
		if (!user) return res.status(404).send("User not found");

		// Send the user data with status 200
		return res.status(200).send(user);
	} catch (error) {
		return res.status(400).send(error);
	}
});

// delete user by id
router.delete("/:userId", auth, async (req, res) => {
	try {
		if (req.params.userId != req.payload._id && !req.payload.isAdmin)
			return res.status(401).send("You do not have permission to delete this user");

		// find the user in the database
		const user = await User.findByIdAndDelete(req.params.userId);
		if (!user) return res.status(404).send("User not found");

		// Send success response
		res.status(200).send("User and associated cards deleted successfully");
	} catch (error) {
		res.status(400).send(error.message);
	}
});

router.put("/:id", auth, async (req, res) => {
	try {
		// check if user have permission to update this user data
		if (req.params.id !== req.payload._id && !req.payload.isAdmin)
			return res
				.status(401)
				.send("You don't have permission to update this user data");

		// validate the body
		const {error} = userUpdateJoiSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// find and update the user
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		}).select("-password");
		if (!user) return res.status(405).send("User not found");

		// return the user with new updates
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

//change business status
router.patch("/:id", auth, async (req, res) => {
	try {
		// Check if the user is authorized to edit their profile
		if (req.payload._id !== req.params.id && !req.payload.isAdmin)
			return res.status(401).send("Unauthorized");

		// find the user
		const user = await User.findOneAndUpdate(
			{_id: req.params.id},
			{$set: {isBusiness: !req.body.isBusiness}},
			{new: true},
		);
		if (!user) return res.status(404).send("User not found");

		// send the result status
		res.status(200).send(
			`your business account status is: ${user.isBusiness ? "Business" : "Client"}`,
		);
	} catch (error) {
		res.status(400).send(error);
	}
});

// update user data
router.post("/subscripeForNews", async (req, res) => {
	try {
		const {error} = subscripeForNews.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// find the email on database
		const subscripeEmail = await User.findOne({email: req.body.email});
		if (subscripeEmail)
			return res.status(400).send("This email has supscriped before");

		const setNewSubscripeEmail = new SpscripeForNews(req.body);

		// save the email
		await setNewSubscripeEmail.save();
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
