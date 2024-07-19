import { 	
	Select, 
	MenuItem, 
	SelectChangeEvent, 
	Box,
	TextField,
	Button,
	InputLabel,
	FormControl
} from "@mui/material";
import { FC, useContext, useState, Dispatch, SetStateAction  } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {BufferUnitTypes} from "./TransformTypes"
import { Feature } from "geojson";

type BufferTransformProps = {
	draw: MapboxDraw,
	activeFeatures: Feature[],
	setLoading: Dispatch<SetStateAction<boolean>>;
}

const BufferTransform:FC<BufferTransformProps> = ({draw, activeFeatures, setLoading}) => {
	const { theme } = useContext(ThemeContext);
	const [units, setUnits] = useState<BufferUnitTypes>("meters");
	const [distance, setDistance] = useState<number | null>(100);

	const handleUnitChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (value === "meters" || value === "kilometers" || value === "miles" || value === "feet") {
			setUnits(value);
		}
	}

	const handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setDistance(numValue);
		} else {
			setDistance(null);
		}
	}

	const handleApplyBuffer = () => {
		setLoading(true);
		console.log(activeFeatures);
	}
	
	return (
		<Box
			sx={{
				mt:2,
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Box 
				sx={{
					flexDirection: "row",
					display: "flex"
				}}
			>
				<TextField
					value={distance}
					onChange={handleDistanceChange}
					variant="outlined"
					label="Distance"
					InputLabelProps={{
						sx: {
							color: theme.palette.text.secondary,
							'&.Mui-focused': {
								color: theme.palette.text.secondary,
							},
						}
					}}
					sx={{
						flex: 1,
						minWidth: 130,
						'& .MuiOutlinedInput-root': {
							color: theme.palette.text.primary,
							'& fieldset': {
								borderColor: theme.palette.text.secondary, 
							},
							'&:hover fieldset': {
								borderColor: theme.palette.text.secondary, 
							},
							'&.Mui-focused fieldset': {
								borderColor: theme.palette.text.primary,
							},
						},
						'& input': {
							height: '3px', 
						},
						// Add this to increase specificity for the InputAdornment
						'& .MuiInputAdornment-root .MuiTypography-root': {
							color: `${theme.palette.text.secondary} !important`,
						},
					}}
				/>
				<FormControl>
					<InputLabel 
						sx={{
							color: theme.palette.text.secondary,
							'&.Mui-focused': {
								color: theme.palette.text.secondary,
							},
							ml: 1
						}}
					>
						Units
					</InputLabel>
					<Select
						value={units}
						label="Units"
						onChange={handleUnitChange}
						variant="outlined"
						IconComponent={ArrowDropDownIcon}
						sx={{
							fles: 1,
							ml: 1,
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
						<MenuItem value={"meters"}>Meters</MenuItem>
						<MenuItem value={"kilometers"}>Kilometers</MenuItem>
						<MenuItem value={"miles"}>Miles</MenuItem>
						<MenuItem value={"feet"}>Feet</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Button
				variant="contained"
				disabled={activeFeatures.length > 0 ? false : true}
				fullWidth
				sx={{
					mt: 2,
				}}
				onClick={handleApplyBuffer}
			>
				Apply Buffer <ArrowRightIcon />
			</Button>
		</Box>
	);
}

export default BufferTransform;

