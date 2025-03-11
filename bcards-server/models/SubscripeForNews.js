const mongoose = require("mongoose");

const subscripeForNews = mongoose.Schema({
	email: {type: String, required: true, email: true},
});

const UsersubscripeForNews = mongoose.model("SubscripesForNews", subscripeForNews);

module.exports = UsersubscripeForNews;
