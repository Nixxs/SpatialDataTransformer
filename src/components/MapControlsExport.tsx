import { 
	Typography, 
	Box, 
	Select, 
	MenuItem, 
	SelectChangeEvent, 
	InputLabel, 
	FormControl, 
	TextField, 
	InputAdornment,
	Button } from "@mui/material";
import { FC, useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MapControlsExport:FC = () => {
	const {theme} = useContext(ThemeContext);
	const [outputFormat, setOutputFormat] = useState<string>("shp");
	const [outputCRS, setOutputCRS] = useState<number | null>(4326);

	const handleOutputFormatChange = (event: SelectChangeEvent) => {
		setOutputFormat(event.target.value as string);
	}

	const handleOutputCRSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setOutputCRS(numValue);
		} else {
			setOutputCRS(null);
		}
	}

	return (
		<Box
			sx={{
				borderWidth: 0.5,
				flex: 1,
				borderStyle: "dashed",
				borderColor: theme.palette.text.secondary,
				borderRadius: 2,
				ml: 3,
				mr: 3,
				p: 2
			}}
		>
			<Typography
				sx={{
					fontSize: 16,
					fontWeight: 500,
					color: theme.palette.text.secondary
				}}
			>
				Export Features
			</Typography>
			<FormControl 
				sx={{
					mt: 2,
					flexDirection: "row"
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
					Output Format
				</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={outputFormat}
					label="Output Format"
					onChange={handleOutputFormatChange}
					variant="outlined"
					IconComponent={ArrowDropDownIcon}
					sx={{
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
					<MenuItem value={"shp"}>Shapefile</MenuItem>
					<MenuItem value={"gpkg"}>Geopackage</MenuItem>
					<MenuItem value={"dxf"}>DXF</MenuItem>
				</Select>
				<TextField
					value={outputCRS}
					onChange={handleOutputCRSChange}
					variant="outlined"
					label="Output CRS"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								EPSG:
							</InputAdornment>
						)
					}}
					InputLabelProps={{
						sx: {
							color: theme.palette.text.secondary,
							'&.Mui-focused': {
								color: theme.palette.text.secondary,
							},
						}
					}}
					sx={{
						ml: 1,
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
				<Button
					variant="outlined"
					sx={{
						ml: 1,
						height: 35
					}}
				>
					export
				</Button>
			</FormControl >
		</Box>
	);
}

export default MapControlsExport;