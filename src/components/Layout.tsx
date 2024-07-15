import {Box, Typography} from '@mui/material';
import { ThemeContext } from "./ThemeContext";
import { useContext } from 'react';
import MapContainer from "./MapContainer";


const Layout = () => {
	const {theme} = useContext(ThemeContext);

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
					<MapContainer />
				</Box>

			</Box>
		</Box>
	);
}

export default Layout;