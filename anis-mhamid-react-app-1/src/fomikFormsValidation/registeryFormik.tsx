import * as yup from "yup";

export const registeryFormikValues = {
	name: {
		first: "",
		middle: "",
		last: "",
	},
	phone: "",
	email: "",
	password: "",
	image: {
		url: "",
		alt: "",
	},
	address: {
		state: "",
		country: "",
		city: "",
		street: "",
		houseNumber: "0",
		zip: "0",
	},
	isBusiness: false,
};

export const registeryFormikShcema = yup.object({
	name: yup.object({
		first: yup.string().required("Name is required").min(2).max(256),
		middle: yup.string().min(2).max(256).optional(),
		last: yup.string().required().min(2).max(256),
	}),
	phone: yup
		.string()
		.required()
		.min(9)
		.max(10)
		.matches(
			/^(\(\d{3}\)\s?|\d{3}[-]?)\d{3}[-]?\d{4}$|^\d{10}$/,
			"Invalid phone number format. Example: (123) 456-7890 or 123-456-7890",
		),
	email: yup
		.string()
		.required("Email is required")
		.email("Invalid email format")
		.min(5, "Email must be at least 5 characters long")
		.matches(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters long")
		.max(30, "Password must be at most 20 characters long")
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=-_].{8,}$)/,
			"Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character(Abc12345[!@#$%^&*-_+=])",
		),
	image: yup.object({
		url: yup
			.string()
			.min(14, "Image URL must be at least 14 characters long")
			.url("Please provide a valid URL")
			.default(
				"https://images.unsplash.com/photo-1740418644050-7c315b61bbff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
			)
			.matches(/https?:\/\/[^\s]+/),
		alt: yup
			.string()
			.min(2, "Image alt text must be at least 2 characters long")
			.default("Profile"),
	}),
	address: yup.object({
		state: yup.string().min(2).max(256).optional(),
		country: yup.string().min(2).max(256).required("Country is required"),
		city: yup.string().min(2).max(256).required("City is required"),
		street: yup.string().min(2).max(256).required("Street is required"),
		houseNumber: yup.number().min(1).required("House number is required"),
		zip: yup.string().min(2).required("Zip code is required"),
	}),
	isBusiness: yup.boolean(),
});
