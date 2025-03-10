const express = require("express");
const router = express.Router();
const Joi = require("joi");
const chalk = require("chalk");
const auth = require("../middlewares/auth");
const Cards = require("../models/Card");

const cardSchema = Joi.object({
	_id: Joi.string(),
	title: Joi.string().required(),
	subtitle: Joi.string().required(),
	description: Joi.string().optional(),
	phone: Joi.string()
		.min(9)
		.max(10)
		.required()
		.regex(/^05\d{8,9}$/),
	email: Joi.string().email().min(5).required(),
	web: Joi.string().optional().allow(""),
	image: Joi.object({
		url: Joi.string().uri().required(),
		alt: Joi.string().required(),
	}),
	address: Joi.object({
		state: Joi.string().allow("").default("not defined"),
		country: Joi.string().min(2).required(),
		city: Joi.string().min(2).required(),
		street: Joi.string().min(2).required(),
		houseNumber: Joi.number().required(),
		zip: Joi.string().default("00000"),
	}),
	bizNumber: Joi.number(),
	likes: Joi.array().items(Joi.string()),
	user_id: Joi.string(),
	__v: Joi.number().optional(),
});

// function to generate the bizNumber
async function generateBizNumber() {
	const randomBizNumber = Math.floor(Math.random() * 1000000);
	return randomBizNumber;
}

// created card from spicific business user or admin users
router.post("/", auth, async (req, res) => {
	try {
		// chech if the user is admin or business or not
		if (!(req.payload.isBusiness || req.payload.isAdmin)) {
			console.log(chalk.red("Only business or admin accounts can add cards"));
			return res.status(403).send("Only business or admin accounts can add cards");
		}

		// validate body
		const {error} = cardSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// fined if the card is exists
		let card = await Cards.findOne({email: req.body.email});
		if (card) return res.status(409).send("The card already exists");

		// bizNumber
		let bizNumber = await generateBizNumber();
		while (await Cards.findOne({bizNumber})) {
			bizNumber = await generateBizNumber(); // Ensure unique business number
		}

		// create new card
		const newCard = new Cards({...req.body, bizNumber, user_id: req.payload._id});

		// svae the cards on database
		await newCard.save();

		console.log(chalk.green("Card added successfully"));
		return res.status(201).send(newCard);
	} catch (error) {
		console.log(chalk.red("Internal server error"));
		res.status(400).send(error.message);
	}
});

// update card by id
router.put("/:id", auth, async (req, res) => {
	try {
		// find card by ID
		const card = await Cards.findById(req.params.id);
		if (!card) return res.status(404).send("User not found");

		// check if user cave permission to update the card
		if (card.user_id !== req.payload._id && !req.payload.isAdmin)
			return res.status(401).send("Only owner or admin users can update the card");

		// check body validation
		const {error} = cardSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// get the userCard and update
		let userCardToUpdae = await Cards.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!userCardToUpdae) return res.status(404).send("Card not found");

		// // save the card
		// await userCardToUpdae.save();

		// return the card
		res.status(200).send(userCardToUpdae);
	} catch (error) {
		res.status(400).send(error);
	}
});

// update like
router.patch("/like/:cardId/:userId", auth, async (req, res) => {
	try {
		if (!req.payload) return res.status(401).send("Please login to add like");

		const {cardId, userId} = req.params;

		// Find the card by cardId
		const card = await Cards.findById(cardId);
		if (!card) return res.status(404).send("Card not found");

		// Check if the userId is already in the likes array
		const isLiked = card.likes.includes(userId);

		// If user already liked, remove their ID (unlike)
		if (isLiked) {
			card.likes = card.likes.filter((like) => like !== userId);
		} else {
			// If not liked yet, add userId to likes
			card.likes.push(userId);
		}
		// Save the updated card document
		await card.save();

		res.status(200).json(card);
	} catch (error) {
		console.log(error);
	}
});

// dele card by user have the card or admin users
router.delete("/:id", auth, async (req, res) => {
	try {
		// check if user is not a business user or admin before performing permission check
		if (!req.payload.isBusiness && !req.payload.isAdmin) {
			let cardToDelete = await Cards.findById(req.params.id);
			if (!cardToDelete) return res.status(404).send("Card not found");

			// check if the card belongs to the user
			if (cardToDelete.user_id !== req.payload._id)
				return res
					.status(403)
					.send("You do not have permission to delete this card");
		} else {
			// check If the user is an admin or business user, just fetch the card to delete it
			cardToDelete = await Cards.findById(req.params.id);
			if (!cardToDelete) return res.status(404).send("Card not found");
		}

		await Cards.findByIdAndDelete(req.params.id);

		res.status(200).send("The card has been deleted successfully");
	} catch (error) {
		res.status(400).send(error);
	}
});

// get all cards for global users
router.get("/", async (req, res) => {
	try {
		// find the cads
		const cards = await Cards.find();
		// check if cards is empty
		if (!cards.length) return res.status(400).send("no cards to provide");

		res.status(200).send(cards);
	} catch (error) {
		res.status(400).send(error);
	}
});

// get all cards for spicific user
router.get("/my-cards", auth, async (req, res) => {
	try {
		// Ensure the user is logged in
		if (!req.payload._id) {
			return res.status(401).send("You have to login to see your cards");
		}
		const specific_user_cards = await Cards.find({user_id: req.payload._id});
		if (specific_user_cards.length === 0)
			return res.status(404).send("No cards found for this user");

		res.status(200).send(specific_user_cards);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

// get spicific card by id
router.get("/:id", async (req, res) => {
	try {
		const card_by_id = await Cards.findOne({_id: req.params.id});
		if (!card_by_id) return res.status(404).send("Card not found");
		res.status(200).send(card_by_id);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;
