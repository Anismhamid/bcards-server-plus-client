const {Schema, mongoose} = require("mongoose");

const cardSchema = new mongoose.Schema(
	{
		title: {type: String, required: true},
		subtitle: {type: String, required: true},
		description: {type: String},
		phone: {
			type: String,
			required: true,
			match: [
				/^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/,
				"Invalid phone number format. Example: (123) 456-7890 or 123-456-7890",
			],
		},
		email: {type: String, required: true, minlength: 5},
		web: {type: String},
		image: {
			type: {
				url: {type: String, required: true},
				alt: {type: String, required: true},
			},
		},
		address: {
			type: {
				state: {type: String, default: "not defined"},
				country: {type: String, required: true},
				city: {type: String, required: true},
				street: {type: String, required: true},
				houseNumber: {type: Number, required: true},
				zip: {type: String, default: "0"},
			},
		},
		bizNumber: {type: Number},
		likes: {type: Array},
		user_id: {type: String},
		createdAt: {type: String, default: new Date().toLocaleString()},
		updatedAt: {type: String, default: new Date().toLocaleString()},
		__v: {type: Number},
	},
	{timestamps: true},
);

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;
