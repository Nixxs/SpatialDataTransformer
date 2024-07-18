// MAP STYLES:
// mapbox://styles/mapbox/standard
// mapbox://styles/mapbox/streets-v12
// mapbox://styles/mapbox/outdoors-v12
// mapbox://styles/mapbox/light-v11
// mapbox://styles/mapbox/dark-v11
// mapbox://styles/mapbox/satellite-v9
// mapbox://styles/mapbox/satellite-streets-v12
// mapbox://styles/mapbox/navigation-day-v1
// mapbox://styles/mapbox/navigation-night-v1

export const lightTheme = {
	type: "light",
	mapTheme: "mapbox://styles/mapbox/streets-v12",
	palette: {
		text: {
			primary: "#000",
			secondary: "#878787"
		},
		error: {
			primary: "#6b2323",
			secondary: "#ebb2b2"
		},
		primary: {
			main: "#47acff",
		},
		secondary: {
			main: "#f50057",
		},
		background: {
			default: "#e0ecff",
			paper: "#fff",
		},
		map: {
			space: "#f0f4f7",
			fogColor: "#b3c8e3",
			fogHighColor: "#fff",
		}
	},
};

export const darkTheme = {
	type: "dark",
	mapTheme: "mapbox://styles/mapbox/streets-v12",
	palette: {
		text: {
			primary: "#fff",
			secondary: "#878787"
		},
		error: {
			primary: "#6b2323",
			secondary: "#ebb2b2"
		},
		primary: {
			main: "#47acff",
		},
		secondary: {
			main: "#3f51b5",
		},
		background: {
			default: "#242424",
			paper: "#333",
		},
		map: {
			space: "#14181f",
			fogColor: "#b3c8e3",
			fogHighColor: "#36414f",
		}
	},
};
