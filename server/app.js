const express = require("express");
const helmet = require("helmet");
const app = express();
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
require("dotenv").config({path: envFile});
const cors = require("cors");
const {logger, logToFile} = require("./middlewares/logger");

const mongoose = require("mongoose");
const users = require("./routes/users");
const cards = require("./routes/cards");
const chalk = require("chalk");
const expressRoutes = require("express-list-routes");
const morgan = require("morgan");
const {rateLimit} = require("express-rate-limit");

const port = process.env.PORT || 8000;

const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // hours / minutes / seconds / milliseconds :: 24 hours
	limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours).
	standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});




// Middlewares
app.use(logger);
logToFile()
app.use(limiter); // Apply the rate limiting middleware to all requests.
app.use(express.json());
app.use(cors());
app.use(helmet());



// MongoDB connection
mongoose
	.connect(process.env.DB)
	.then(() =>
		console.log(
			chalk.green(
				"Server connected to MongoDB",
				chalk.blue(new Date().toLocaleString()),
			),
		),
	)
	.catch((error) =>
		console.log(chalk.red.bold("Error while connecting to MongoDB:"), error),
	);

// morgan method
app.use(
	morgan(
		chalk.underline.cyan(
			":method :url :status :res[content-length] - :response-time ms :date[web]",
		),
	),
);

// Routes
app.use("/api/users", users);
app.use("/api/cards", cards);

// Start server
app.listen(port, () => console.log(chalk.blue.bold("Server started on port: "), port));

if (process.env.NODE_ENV === "development") {
	console.log(chalk.bgWhite.red.bold("App is running in Development mode"));
	expressRoutes(app);
} else {
	console.log(chalk.bgWhiteBright.bold("App is running in Production mode"));
}
