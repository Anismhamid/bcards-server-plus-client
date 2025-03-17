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
const {rateLimit} = require("express-rate-limit");

const port = process.env.PORT || 8000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // hours / minutes / seconds /:: 24 hours
	limit: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
	// Save the original res.send method
	const originalSend = res.send;

	// Intercept the response
	res.send = function (body) {
		// Log if the status code is 400 or higher
		if (res.statusCode >= 400) {
			// Log the error details
			logToFile(res.statusCode, body);
		} else {
			// Log every request to access log id code less thane 400
			const accessLogMessage = `${req.method} ${req.originalUrl} - Status: ${res.statusCode}\n`;

			// Append the requist message to the access file
			fs.appendFile(
				path.join(
					__dirname,
					"access",
					`${new Date().toISOString().split("T")[0]}.log`,
				),
				accessLogMessage,
				(err) => {
					if (err) console.error("Error logging access:", err);
				},
			);
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

// Morgan stream (logging HTTP requests)
// const stream = fs.createWriteStream(path.join(__dirname, "logs", "http-logs.log"), {
// 	flags: "a",
// });

app.use(
	morgan(
		chalk.underline.cyan(
			":method :url :status :res[content-length] - :response-time ms :date[web]",
		),
		// {stream},
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
