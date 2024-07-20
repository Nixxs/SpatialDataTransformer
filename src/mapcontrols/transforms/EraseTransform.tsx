import { 	
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	TextField,
	SelectChangeEvent
} from "@mui/material";
import { FC, Dispatch, SetStateAction, useState, useContext, useRef } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Feature } from "geojson";
import { zoomToBounds } from "../../utils/MapOperations";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from "axios";

type EraseTransformProps = {
	map: mapboxgl.Map | null,
	draw: MapboxDraw,
	activeFeatures: Feature[],
	setLoading: Dispatch<SetStateAction<boolean>>,
	handleSetErrorMessage: (message:string | null) => void,
	handleUpdateDrawnFeatures: (features: Feature[]) => void,
	stopRotation: () => void
}

type InputFormat = "shp" | "dxf" | "gpkg"

type UploadConfig = {
	output_format: string,
	output_crs: string,
	input_crs?: string,
}

const EraseTransform:FC<EraseTransformProps> = ({map, draw, activeFeatures, setLoading, handleSetErrorMessage, handleUpdateDrawnFeatures, stopRotation}) => {
	const { theme } = useContext(ThemeContext);
	const [inputFormat, setInputFormat] = useState<InputFormat>("shp");
	const [inputCRS, setInputCRS] = useState<number | null>(4326);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [eraseFeatures, setEraseFeatures] = useState<Feature[]>([]);

	const handleInputFormatChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (value === "shp" || value === "dxf" || value === "gpkg") {
			setInputFormat(value);
		}
	}

	const handleInputCRSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setInputCRS(numValue);
		} else {
			setInputCRS(null);
		}
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleApplyErase = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": activeFeatures
			},
			"output_format": "geojson",
			"transformations":[
				{
					"type":"erase",
					"erasing_geojson":{
						"type": "FeatureCollection",
						"features": eraseFeatures
					}
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

					setEraseFeatures([]);

					// Update the source data for the layers
					const source = map?.getSource('combined-features') as mapboxgl.GeoJSONSource;
					source.setData(geojsonData);
	
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

	const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

			const config:UploadConfig = {
                output_format: "geojson",
				output_crs: "EPSG:4326"
            };

            if (inputFormat === "dxf" && inputCRS) {
                config.input_crs = `EPSG:${inputCRS}`;
            }

            formData.append('config', JSON.stringify(config));

			const response = await axios.post(
                `https://api.geoflip.io/v1/transform/${inputFormat}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'apiKey': `${import.meta.env.VITE_GEOFLIP_API}`,
                    }
                }
            );

            if (response.status === 200) {
				const geojsonData = response.data;
				const responseEraseFeatures: Feature[] = geojsonData.features;
				setEraseFeatures(geojsonData.features);
			
				// Find the maximum ID in activeFeatures
				const maxId = activeFeatures.reduce((max, feature) => {
					const id = feature.id ? parseInt(feature.id.toString(), 10) : 0;
					return id > max ? id : max;
				}, 0);
			
				// Increment the IDs in responseEraseFeatures starting from maxId + 1
				responseEraseFeatures.forEach((feature, index) => {
					feature.id = (maxId + index + 1).toString();

					if (!feature.properties) {
						feature.properties = {};
					}
					feature.properties.style = "red";
				});
			
				// Combine the features from both FeatureCollections
				const combinedFeatures: GeoJSON.FeatureCollection = {
					type: "FeatureCollection",
					features: [...activeFeatures, ...responseEraseFeatures]
				};

				// Set the combined features in draw
				draw.set(combinedFeatures);

				// Update the source data for the layers
				const source = map?.getSource('combined-features') as mapboxgl.GeoJSONSource;
				source.setData(combinedFeatures);
			
				stopRotation();
				zoomToBounds(map, combinedFeatures.features);
            }

            setSelectedFile(null);

        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setLoading(false);
        }
    };
	
	return (
		<Box
			sx={{
				mt:2,
				display: "flex",
				flexDirection: "column"
			}}
		>
			<FormControl 
				sx={{
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
					Input Format
				</InputLabel>
				<Select
					value={inputFormat}
					label="Input Format"
					onChange={handleInputFormatChange}
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
					<MenuItem value={"shp"}>Shapefile</MenuItem>
					<MenuItem value={"gpkg"}>Geopackage</MenuItem>
					<MenuItem value={"dxf"}>DXF</MenuItem>
				</Select>
				{inputFormat == "dxf" && (
					<TextField
						value={inputCRS}
						onChange={handleInputCRSChange}
						variant="outlined"
						label="Input CRS"
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
							flex: 1,
							ml: 1,
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
				)}
				<input
                    type="file"
                    accept={inputFormat == "shp" ? ".zip" : `.${inputFormat}`}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<CloudUploadIcon 
						sx={{
							mb: 0.5
						}}
					/>}
                    sx={{
                        height: 36,
                        textTransform: 'none',
						ml: 1,
						flex: 2
                    }}
                >
                    {selectedFile ? selectedFile.name : "BROWSE"}
                </Button>
			</FormControl >
			<Box
				sx={{
					display: "flex",
					flexDirection:"row",
					mt: 2
				}}
			>
                <Button
                    variant="contained"
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    sx={{
                        height: 36,
						flex: 1
                    }}
                >
                    Upload
                </Button>
				<Button
					variant="contained"
					disabled={activeFeatures.length > 0 && eraseFeatures.length > 0 ? false : true}
					fullWidth
					onClick={handleApplyErase}
					sx={{
						ml: 1,
						flex: 2
					}}
				>
					Apply Erase <ArrowRightIcon />
				</Button>
			</Box>

		</Box>
	);
}

export default EraseTransform;

