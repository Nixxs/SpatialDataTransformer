import {ReactNode, FC, useContext} from 'react';
import {Box} from '@mui/material';
import { ThemeContext } from "./ThemeContext";

type ContentProps = {
	  children: ReactNode;
};

const Content:FC<ContentProps> = ({children}) => {
	const { theme }  = useContext(ThemeContext);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: "100vh",
				padding: 0,
				margin: 0,
				backgroundColor: theme.palette.background.default,
			}}
		>
			{children}
		</Box>
	);
}

export default Content;