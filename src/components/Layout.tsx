import {Box} from '@mui/material';
import { ThemeContext } from "./ThemeContext";
import { useContext } from 'react';


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
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: theme.palette.background.paper,
					borderRadius: 3,
				}}
			>
				<h1>Header</h1>
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
					<h2>Map</h2>
				</Box>

			</Box>
		</Box>
	);
}

export default Layout;