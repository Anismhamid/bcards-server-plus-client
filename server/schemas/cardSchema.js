const Joi = require("joi");

// cardSchema
const cardSchema = Joi.object({
	_id: Joi.string(),
	title: Joi.string().required(),
	subtitle: Joi.string().required(),
	description: Joi.string().optional(),
	phone: Joi.string()
		.min(9)
		.max(10)
		.required()
		.regex(/^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/, "Phone number format")
		.message("Invalid phone number format. Example: (123) 456-7890 or 123-456-7890"),
	email: Joi.string().email().min(5).required(),
	web: Joi.string().allow(""),
	image: Joi.object({
		url: Joi.string().uri().required(),
		alt: Joi.string().required(),
	}),
	address: Joi.object({
		state: Joi.string().allow("").default("not defined"),
		country: Joi.string().min(2).required(),
		city: Joi.string().min(2).required(),
		street: Joi.string().min(2).required(),
		houseNumber: Joi.number().required().default(0o0),
		zip: Joi.string().default(0o0),
	}),
	bizNumber: Joi.number(),
	likes: Joi.array().items(Joi.string()),
	user_id: Joi.string(),
	__v: Joi.number(),
});

module.exports = cardSchema;