const express = require("express");
const helmet = require("helmet");
const app = express();
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
require("dotenv").config({path: envFile});
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./routes/users");
const cards = require("./routes/cards");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const expressRoutes = require("express-list-routes");
const morgan = require("morgan");

const port = process.env.PORT || 8000;

// File logger to log requests with status code 400 and above
const logToFile = (statusCode, errorMessage) => {
	const date = new Date();
	const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
	const logDir = path.join(__dirname, "logs"); // Directory to store log files
	const logFilePath = path.join(logDir, `${formattedDate}.log`); // Log file path based on the date

	// Create the logs directory if it doesn't exist
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir);
	}

	// Prepare log message
	const logMessage = `${new Date().toLocaleString()} - Status Code: ${statusCode} - Error: ${errorMessage}\n`;

	// Append the log message to the file
	fs.appendFile(logFilePath, logMessage, (err) => {
		if (err) {
			console.error("Error writing to log file:", err);
		}
	});
};

// Logger middleware
const logger = (req, res, next) => {
	const originalSend = res.send; // Save the original res.send method

	// Intercept the response
	res.send = function (body) {
		// Log if the status code is 400 or higher
		if (res.statusCode >= 400) {
			logToFile(res.statusCode, body); // Log the error details
		}
		originalSend.call(this, body); // Continue the normal response flow
	};
	console.log(req.method + req.url);
	next();
};

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

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(helmet());
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
