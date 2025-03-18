import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";

interface DecodedToken {
	exp: number;
	iat: number;
	[key: string]: any;
}

function useToken() {
	const token = localStorage.getItem("bCards_token");
	const [decodedToken, setAfterDecode] = useState<any>({});
	const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());

	useEffect(() => {
		const checkToken = () => {
			if (token) {
				try {
					const decoded: DecodedToken = jwtDecode(token);
					const currentTime = Date.now() / 1000;

					if (decoded.exp < currentTime) {
						localStorage.removeItem("bCards_token");
						setAfterDecode(null);
					} else {
						setAfterDecode(decoded);
					}
				} catch (error) {
					console.log("Invalid token:", error);
					localStorage.removeItem("bCards_token");
					setAfterDecode(null);
				}
			}
		};

		const handleUserActivity = () => {
			setLastActivityTime(Date.now());
		};

		const autoLogout = () => {
			const currentTime = Date.now();
			const inactiveTime = currentTime - lastActivityTime;

			// if more than 4 hours has passed since the last activity
			if (inactiveTime > 4 * 60 * 60 * 1000) {
				localStorage.removeItem("bCards_token");
				setAfterDecode(null);
			}
		};

		checkToken();

		// listen for mouse or keyboard activity
		window.addEventListener("keydown", handleUserActivity);

		// Check for inactivity every 5 seconds
		const inactivityInterval = setInterval(autoLogout, 5000);

		const handleStorageChange = () => {
			checkToken();
		};

		window.addEventListener("storage", handleStorageChange);

		// Cleanup event listeners and interval on component unmount
		return () => {
			window.removeEventListener("keydown", handleUserActivity);
			window.removeEventListener("storage", handleStorageChange);
			clearInterval(inactivityInterval);
		};
	}, [token, lastActivityTime]);

	return {decodedToken};
}

export default useToken;
