import { FC, useContext } from "react";
import { 
	Typography, 
	Box, 
} from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LngLat } from "mapbox-gl";
import { ThemeContext } from "./ThemeContext";
import { Feature } from "geojson";
import MapControlsExport from "./MapControlsExport";

type MapControlProps = {
	draw: MapboxDraw,
	mapCentrePosition: LngLat,
	activeFeatures: Feature[]
};

const MapControls:FC<MapControlProps> = ({draw, mapCentrePosition, activeFeatures}) => {
	const {theme} = useContext(ThemeContext);


	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Box
				sx={{
					mb: 2,
					flex: 1,
					textAlign: "center"
				}}
			>
				<Typography
					sx={{
						fontWeight: 600,
						fontSize: 24,
						mt: 2
					}}
				>
					Map Controls
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						mt: 1,
					}}
				>
					<Typography 
						sx={{
							flex: 1,
							fontSize: 11,
							color: theme.palette.text.secondary,
							textAlign: "right",
							mr: 1
						}}
					>
						Position (lat/lng): {mapCentrePosition.lat.toFixed(2)},{mapCentrePosition.lng.toFixed(2)}
					</Typography>
					<Typography 
						sx={{
							flex: 1,
							fontSize: 11,
							color: theme.palette.text.secondary,
							textAlign: "left",
							ml: 1
						}}
					>
						Active Features: {activeFeatures.length}
					</Typography>
				</Box>
			</Box>
			
			<MapControlsExport />
		</Box>

	);
}

export default MapControls;