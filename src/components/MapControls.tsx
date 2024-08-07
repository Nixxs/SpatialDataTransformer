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
import MapControlsExport from "../mapcontrols/MapControlsExport";
import MapControlsUpload from "../mapcontrols/MapControlsUpload";
import MapControlsTransform from "../mapcontrols/MapControlsTransform";
import CloseIcon from '@mui/icons-material/Close';


type MapControlProps = {
	map: mapboxgl.Map | null,
	draw: MapboxDraw,
	mapCentrePosition: LngLat,
	activeFeatures: Feature[],
	handleUpdateDrawnFeatures: (features:Feature[]) => void
	stopRotation: () => void
};

const MapControls:FC<MapControlProps> = ({map, draw, mapCentrePosition, activeFeatures, handleUpdateDrawnFeatures, stopRotation}) => {
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
					textAlign: "center",
					display: {xs:"none", sm:"none", md:"inline", }
				}}
			>
				<Typography
					sx={{
						fontWeight: 600,
						fontSize: 24,
						mt: 2,
						color: theme.palette.text.secondary
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
							textAlign: "center",
							mr: 1
						}}
					>
						Position (lat/lng): {mapCentrePosition.lat.toFixed(2)},{mapCentrePosition.lng.toFixed(2)}
						{" "}
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
							position: 'relative', 
							display: 'flex', 
							alignItems: 'flex-start',
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

			<Box
				sx={{
					mt: {xs:3, sm:3, md:0},
				}}
			>
				<MapControlsUpload
					map={map}
					draw={draw}
					handleUpdateDrawnFeatures={handleUpdateDrawnFeatures}
					stopRotation={stopRotation}
				/>
				<MapControlsTransform 
					map={map}
					draw={draw}
					activeFeatures={activeFeatures}
					handleSetErrorMessage={handleSetErrorMessage}
					handleUpdateDrawnFeatures={handleUpdateDrawnFeatures}
					stopRotation={stopRotation}
				/>
				<MapControlsExport 
					activeFeatures={activeFeatures}
					handleSetErrorMessage={handleSetErrorMessage}
				/>
			</Box>
		</Box>
	);
}

export default MapControls;