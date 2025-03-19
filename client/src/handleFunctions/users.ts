import {errorMSG, infoMSG} from "../atoms/taosyify/Toastify";
import {deleteUserById} from "../services/userServices";

// EditUser handle Delete
export const handleDelete_User = (userId: string) => {
		deleteUserById(userId)
			.then(() => {
				infoMSG(`User deleted successfully`);
			})
			.catch(() => {
				errorMSG("Error deleting user.");
			});
};
