const Joi = require("joi");

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
	password: Joi.string().min(8).max(20).required(),
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

// Joi Schema for user update
const userUpdateJoiSchema = Joi.object({
	name: Joi.object({
		first: Joi.string().min(2).required(),
		middle: Joi.string().allow(""),
		last: Joi.string().min(1).required(),
	}),
	isBusiness: Joi.boolean().optional(),
	isAdmin: Joi.boolean().optional(),
	phone: Joi.string()
		.required()
		.min(9)
		.max(10)
		.pattern(/^05\d{8,9}$/)
		.message(
			"The phone number must be an Israeli phone number starting with 05 and max digits is 9-10 ",
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
		url: Joi.string().allow(""),
		alt: Joi.string().default("profile").allow(""),
	}).optional(),
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

// subscripeForNews
const subscripeForNews = Joi.object({
	email: Joi.string().required().email(),
});

module.exports = {
	userRegisterJoiSchema,
	loginSchema,
	subscripeForNews,
	userUpdateJoiSchema,
};
