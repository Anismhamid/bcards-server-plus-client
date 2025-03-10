import axios from "axios";
import {User, UserLogin} from "../interfaces/User";
import {errorMSG, infoMSG} from "../atoms/taosyify/Toastify";

const api: string = import.meta.env.VITE_API_URL;

const getUsers = {
	method: "get",
	url: `${api}/users`,
	headers: {
		Authorization: localStorage.getItem("bCards_token"),
	},
};

// Login function
export async function loginIn(login: UserLogin): Promise<any> {
	try {
		const response = await axios.post(`${getUsers.url}/login`, login);
		return response;
	} catch (error) {
		errorMSG("Login failed, please try again.");
		return null;
	}
}

// Fetch all users
export const getAllUsers = async (page: number, limit: number) => {
	try {
		const response = await axios.request({
			...getUsers,
			url: `${getUsers.url}?page=${page}&limit=${limit}`,
		});
		return response.data;
	} catch (error) {
		errorMSG("Filed to fetch data please try again later");
	}
};

// Get specific user by ID
export const getUserById = (userId: string) => {
	return axios.get(`${getUsers.url}/${userId}`, {
		headers: {
			Authorization: localStorage.getItem("bCards_token"),
		},
	});
};

// Register a new user
export const registerNewUser = async (user: User): Promise<any | null> => {
	try {
		const response = await axios.post(getUsers.url, user, {
			headers: {"Content-Type": "application/json"},
		});
		return response.data;
	} catch (error) {
		errorMSG("Failed to register user. Please try again later.");
	}
};

// Delete specific user by ID
export const deleteUserById = async (userId: string) => {
	try {
		const response = await axios.request({
			...getUsers,
			url: `${getUsers.url}/${userId}`,
			method: "delete",
		});
		return response.data;
	} catch (error) {
		console.log(error);
		errorMSG("Failed to delete user. Please try again later.");
	}
};

export const patchUserBusiness = async (
	cardId: string,
	data: {isBusiness: boolean},
	user: {isBusiness: boolean},
) => {
	try {
		const response = await axios.patch(`${getUsers.url}/${cardId}`, data, {
			headers: {
				Authorization: localStorage.getItem("bCards_token"),
			},
		});
		infoMSG(
			`administration has been changed for ${response.data.email} to ${
				user.isBusiness ? "Client account" : "Business account"
			}`,
		);
		return response.data;
	} catch (error) {
		errorMSG("Failed to update user. Please try again later.");
		return null;
	}
};

// Put specific user by ID
export const putUserData = async (userId: string, data: User) => {
	try {
		const response = await axios.request({
			...getUsers,
			url: `${getUsers.url}/${userId}`,
			method: "put",
			data: data,
		});

		return response.data;
	} catch (error) {
		errorMSG("Failed to update user data. Please try again later.");
		return null;
	}
};
