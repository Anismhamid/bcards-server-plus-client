import {BrowserRouter as Router, Routes} from "react-router-dom";
import {routes} from "./routes/Routes";
import {ToastContainer} from "react-toastify";
import {useEffect, useState} from "react";
import {SiteTheme, theme} from "./theme/theme";
import React from "react";
import Sidebar from "./components/Sidebar";
import {fathMe} from "./fontAwesome/Icons";
import BackToTopbuton from "./atoms/buttons/BackToTopbuton";

function App() {
	const [darkMode, setDarkMode] = useState<boolean>(() => {
		const savedTheme = localStorage.getItem("darkMode");
		return savedTheme ? JSON.parse(savedTheme) : false;
	});
	const timestamp = Math.floor(Date.now() / 1000);
	const readableDate = new Date(timestamp * 1000).toLocaleString();

	console.log(
		`%cWelcome to Bcards!\n%cReact components are the bee's knees! 😄 ${readableDate}`,
		"font-size:1.5em;color:#4558c9;",
		"color:#d61a7f;font-size:1em;",
	);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, []);

	const handleTheme = () => {
		setDarkMode((oldprev) => !oldprev);
	};

	return (
		<SiteTheme.Provider value={darkMode ? theme.dark : theme.light}>
			<Router>
				<ToastContainer />
				{/* Dark Mode Toggle Button */}
				<div className='m-auto bg-dark py-3 d-flex justify-content-between'>
					<button
						style={{width: "50px"}}
						onClick={() => handleTheme()}
						id='toggle-theme'
						aria-label='Toggle theme'
						className='ms-3 btn btn-link border-primary'
					>
						{fathMe}
					</button>
					<p className='text-light m-auto fw-bold'>
						Welcome to
						<strong
							className='mx-1 fs-3 fw-bolder'
							style={{color: "#83B4BC"}}
						>
							bCards
						</strong>
						Your Ultimate Digital Business Card Solution
					</p>
				</div>
				<Sidebar />
				<Routes>
					{Object.entries(routes).map(([key, route]) => (
						<React.Fragment key={key}>{route}</React.Fragment>
					))}
				</Routes>
				<BackToTopbuton />
			</Router>
		</SiteTheme.Provider>
	);
}

export default App;
