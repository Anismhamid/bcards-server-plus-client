const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const auth = require("../middlewares/auth");
const Cards = require("../models/Card");
const cardSchema = require("../schemas/cardSchema");

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

		// return the card
		res.status(200).send(userCardToUpdae);
	} catch (error) {
		res.status(400).send(error);
	}
});

// update like
router.patch("/:id", auth, async (req, res) => {
	try {
		// Check if the user is authorized to edit their profile
		if (!req.payload._id) return res.status(401).send("Unauthorized");

		let card = await Cards.findById(req.params.id);
		if (!card) return res.status(400).send("card not found");

		// Check if the user has already liked the card
		const isLiked = card.likes.includes(req.payload._id);

		// if userId is include in likes array remove the userId
		if (isLiked) {
			card.likes = card.likes.filter((like) => like !== req.payload._id);
		} else {
			// if user id not in the likes add it on
			card.likes.push(req.payload._id);
		}

		// updated card
		await card.save();

		// terusrn the card
		res.status(200).send(card);
	} catch (error) {
		res.status(400).send(error.message);
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
		// check if user is logged in
		if (!req.payload._id) {
			return res.status(401).send("You have to login to see your cards");
		}

		// find the user cards
		const specific_user_cards = await Cards.find({user_id: req.payload._id});
		if (specific_user_cards.length === 0)
			return res.status(404).send("No cards found for this user");

		// return status 200 and user cards
		res.status(200).send(specific_user_cards);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

// get spicific card by id
router.get("/:id", async (req, res) => {
	try {
		// find user card
		const card = await Cards.findById(req.params.id);
		if (!card) return res.status(404).send("Card not found");

		// return status 200 and user card
		res.status(200).send(card);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = router;