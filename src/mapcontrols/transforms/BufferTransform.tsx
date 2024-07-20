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
import { zoomToBounds } from "../../utils/MapOperations";
import axios from "axios";

type BufferTransformProps = {
	map: mapboxgl.Map | null,
	draw: MapboxDraw,
	activeFeatures: Feature[],
	setLoading: Dispatch<SetStateAction<boolean>>,
	handleSetErrorMessage: (message:string | null) => void,
	handleUpdateDrawnFeatures: (features: Feature[]) => void,
	stopRotation: () => void
}

const BufferTransform:FC<BufferTransformProps> = ({map, draw, activeFeatures, setLoading, handleSetErrorMessage, handleUpdateDrawnFeatures, stopRotation}) => {
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

		if (!isNaN(numValue)) {
			setDistance(numValue);
		} else {
			setDistance(null);
		}
	}

	const handleApplyBuffer = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": activeFeatures
			},
			"output_format": "geojson",
			"transformations":[
				{
					"type":"buffer",
					"distance": distance,
					"units": units
				}
			]
		}
		const payloadString = JSON.stringify(payload);

		const fetchData = async () => {
			setLoading(true);
            try {
                const response = await axios.post(
                    `https://api.geoflip.io/v1/transform/geojson`,
					payloadString,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            apiKey: `${import.meta.env.VITE_GEOFLIP_API}`,
                        }
                    }
                );
                if (response.status === 200) {
					const geojsonData = response.data;
					draw.set(geojsonData);
	
					const features = draw.getAll().features
					handleUpdateDrawnFeatures(features);
	
					stopRotation();
					zoomToBounds(map, features);
                } 
            } catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const errorResponse = error.response;
					try {
						const text = await errorResponse.data.text();
						const jsonError = JSON.parse(text);
						handleSetErrorMessage(`error from geoflip - ${jsonError.message}`);
					} catch (parseError) {
						handleSetErrorMessage("An unexpected error occurred. Please try again.");
					}
				} else {
					handleSetErrorMessage(`An unexpected error occurred - ${error}`);
				}
            } finally {
                setLoading(false);
            }
        };

		await fetchData();
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

