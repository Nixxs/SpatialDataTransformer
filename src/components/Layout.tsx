import {Box, Typography} from '@mui/material';
import { ThemeContext } from "./ThemeContext";
import { useContext, useState } from 'react';
import MapContainer from "./MapContainer";
import { LngLat } from "mapbox-gl";


const Layout = () => {
	const {theme} = useContext(ThemeContext);
	const [mapCentrePosition, setMapCentrePosition] = useState(new LngLat(0, 0));

	return (
		<Box
			sx={{
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				padding: 2
			}}
		>
			<Box
				sx={{
					flex: 0,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: theme.palette.background.paper,
					borderRadius: 3,
					padding: 3
				}}
			>
				<Typography 
					sx={{
						fontWeight: 600,
						fontSize: 32
					}}
				>
					Mapbox Drawing Tools
				</Typography>
				<Typography 
					sx={{
						fontWeight: 300,
						fontSize: 18
					}}
				>
					Geoflip Integration Demo
				</Typography>
			</Box>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: theme.palette.background.paper,
						borderRadius: 3,
						marginRight: 2,
						marginTop: 2,
					}}
				>
					<h2>Map Controls</h2>
					<p>
						lat: {mapCentrePosition.lat.toFixed(2)} 
						<br/>
						lng: {mapCentrePosition.lng.toFixed(2)}
					</p>
				</Box>
				<Box
					sx={{
						flex: 3,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: theme.palette.background.paper,
						borderRadius: 3,
						marginTop: 2,
					}}
				>
					<MapContainer 
						centrePosition={mapCentrePosition}
						setCentrePosition={setMapCentrePosition}
					/>
				</Box>

			</Box>
		</Box>
	);
}

export default Layout;