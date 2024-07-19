import { 	
	Typography, 
	Box, 
	Select, 
	MenuItem, 
	SelectChangeEvent, 
	InputLabel, 
	FormControl
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { FC, useContext, useState } from "react";
import { ThemeContext } from "../components/ThemeContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TransformationTypes } from "./transforms/TransformTypes";
import BufferTransform from "./transforms/BufferTransform";
import { Feature } from "geojson";

type MapControlsTransformProps = {
	draw: MapboxDraw,
	activeFeatures: Feature[]
}

const MapControlsTransform:FC<MapControlsTransformProps> = ({draw, activeFeatures}) => {
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [transformationType, setTransformationType] = useState<TransformationTypes>("buffer");

	const handleTransformationTypeChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (value === "buffer" || value === "erase" || value === "clip") {
			setTransformationType(value);
		}
	}

	return(
		<Box
			sx={{
				borderWidth: 0.5,
				flex: 1,
				borderStyle: "dashed",
				borderColor: theme.palette.text.secondary,
				borderRadius: 2,
				mt: 2,
				ml: 3,
				mr: 3,
				p: 2,
				position: 'relative', 
			}}
		>
			<Typography
				sx={{
					fontSize: 16,
					fontWeight: 500,
					color: theme.palette.text.secondary
				}}
			>
				Transform
			</Typography>
			<FormControl 
				sx={{
					mt: 2,
					flexDirection: "row",
					display: "flex"
				}}
			>
				<InputLabel 
					sx={{
						color: theme.palette.text.secondary,
						'&.Mui-focused': {
							color: theme.palette.text.secondary,
						},
					}}
				>
					Transformation
				</InputLabel>
				<Select
					value={transformationType}
					label="Transformation"
					onChange={handleTransformationTypeChange}
					variant="outlined"
					IconComponent={ArrowDropDownIcon}
					sx={{
						fles: 1,
						minWidth: 140,
						color: theme.palette.text.primary, 
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: theme.palette.text.secondary, 
						},
						'&:hover .MuiOutlinedInput-notchedOutline': {
							borderColor: theme.palette.text.secondary, 
						},
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: theme.palette.text.primary, 
						},
						height: '36px',
						'& .MuiSelect-select': {
							paddingTop: '4px',
							paddingBottom: '4px',
						},
						'& .MuiSvgIcon-root': {
							color: theme.palette.text.secondary, 
						},
					}}
				>
					<MenuItem value={"buffer"}>Buffer</MenuItem>
					<MenuItem value={"erase"}>Erase</MenuItem>
					<MenuItem value={"clip"}>Clip</MenuItem>
				</Select>
			</FormControl>

			{ transformationType == "buffer" && (
				<BufferTransform 
					draw={draw}
					activeFeatures={activeFeatures}
					setLoading={setLoading}
				/>
			)}

		</Box>
	);
};

export default MapControlsTransform;