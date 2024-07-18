import { FC, useContext, useState } from "react";
import { 
	Typography, 
	Box,
	IconButton
} from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LngLat } from "mapbox-gl";
import { ThemeContext } from "./ThemeContext";
import { Feature } from "geojson";
import MapControlsExport from "./MapControlsExport";
import CloseIcon from '@mui/icons-material/Close';

type MapControlProps = {
	draw: MapboxDraw,
	mapCentrePosition: LngLat,
	activeFeatures: Feature[]
};

const MapControls:FC<MapControlProps> = ({draw, mapCentrePosition, activeFeatures}) => {
	const {theme} = useContext(ThemeContext);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSetErrorMessage = (message: string | null) => {
		setErrorMessage(message);
	}

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
				{errorMessage && (
					<Box
						sx={{
							mt: 1,
							borderColor: theme.palette.error.primary,
							borderRadius: 2,
							backgroundColor: theme.palette.error.secondary,
							ml: 3,
							mr: 3,
							p: 1,
							position: 'relative', // Add this to position the X button
							display: 'flex',      // Add this to align items
							alignItems: 'flex-start', // Align items to the top
						}}
					>
						<Typography
							sx={{
								color: theme.palette.error.primary,
								fontSize: 13,
								flexGrow: 1
							}}
						>
							<b>ERROR: </b>{errorMessage}
						</Typography>
						<IconButton
							size="small"
							onClick={() => setErrorMessage(null)}
							sx={{
							padding: 0,
							marginLeft: 1,
							color: theme.palette.error.primary,
							'&:hover': {
								backgroundColor: 'transparent',
							},
							}}
						>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Box>
				)}
			</Box>
			
			<MapControlsExport 
				activeFeatures={activeFeatures}
				handleSetErrorMessage={handleSetErrorMessage}
			/>
		</Box>

	);
}

export default MapControls;