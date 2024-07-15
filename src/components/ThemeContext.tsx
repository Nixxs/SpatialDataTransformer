import { createContext, FC, ReactNode, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "../themes/Themes";

type Theme = typeof darkTheme;

type ThemeContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const defaultContextValue: ThemeContextType = {
	theme: darkTheme,
	setTheme: () => {},
};

export const ThemeContext =
	createContext<ThemeContextType>(defaultContextValue);

type ThemeProviderProps = {
	children: ReactNode;
};

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState(darkTheme);

	useEffect(() => {
		const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(userPrefersDark ? darkTheme : lightTheme);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
