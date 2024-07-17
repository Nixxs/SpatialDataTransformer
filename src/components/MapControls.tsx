import { FC, useContext } from "react";
import { Typography, Box } from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LngLat } from "mapbox-gl";
import { ThemeContext } from "./ThemeContext";
import { Feature } from "geojson";

type MapControlProps = {
	draw: MapboxDraw,
	mapCentrePosition: LngLat,
	activeFeatures: Feature[]
};

const MapControls:FC<MapControlProps> = ({draw, mapCentrePosition, activeFeatures}) => {
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
				<br/>
				Active Features: {activeFeatures.length}
			</Typography>
		</Box>

	);
}

export default MapControls;