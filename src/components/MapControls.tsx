import { FC, useContext } from "react";
import { Typography, Box } from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LngLat } from "mapbox-gl";
import { ThemeContext } from "./ThemeContext";

type MapControlProps = {
	draw: MapboxDraw,
	mapCentrePosition: LngLat
};

const MapControls:FC<MapControlProps> = ({draw, mapCentrePosition}) => {
	const {theme} = useContext(ThemeContext);

	return (
		<Box>
			<Typography
				sx={{
					fontWeight: 600,
					fontSize: 24,
					mt: 2
				}}
			>
				Map Controls
			</Typography>
			<Typography 
				sx={{
					fontSize: 11,
					color: theme.palette.text.secondary,
					textAlign: "center"
				}}
			>
				Position: {mapCentrePosition.lat.toFixed(2)},{mapCentrePosition.lng.toFixed(2)}
			</Typography>

			<Typography
				sx={{
					fontWeight: 400,
					fontSize: 14,
					mt: 1,
					color: theme.palette.text.primary,
				}}
			>
				Drawn Features: {0}
			</Typography>
		</Box>

	);
}

export default MapControls;