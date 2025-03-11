import {createContext} from "react";

export const theme = {
	light: {background: "#c7eaea", color: "#161b1f"},
	dark: {
		background: "#161b1f",
		color: "#c7eaea",
	},
	cardsBg: {background: "#010101", color: "#93d7d7"},
};

export const SiteTheme = createContext(theme.light);
