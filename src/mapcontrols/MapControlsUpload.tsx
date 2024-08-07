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
	Button
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { FC, useContext, useState, useRef } from "react";
import { ThemeContext } from "../components/ThemeContext";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import { Feature } from "geojson";
import { zoomToBounds } from "../utils/MapOperations";

type MapControlUploadProps = {
	map: mapboxgl.Map | null,
	draw: MapboxDraw,
	handleUpdateDrawnFeatures: (features: Feature[]) => void,
	stopRotation: () => void
}

type InputFormat = "shp" | "dxf" | "gpkg"

type UploadConfig = {
	output_format: string,
	output_crs: string,
	input_crs?: string,
}

const MapControlsUpload: FC<MapControlUploadProps> = ({map, draw, handleUpdateDrawnFeatures, stopRotation}) => {
	const { theme } = useContext(ThemeContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [inputFormat, setInputFormat] = useState<InputFormat>("shp");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [inputCRS, setInputCRS] = useState<number | null>(4326);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputCRSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setInputCRS(numValue);
		} else {
			setInputCRS(null);
		}
	}

	const handleInputFormatChange = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (value === "shp" || value === "dxf" || value === "gpkg") {
			setInputFormat(value);
		}
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedFile(event.target.files[0]);
		}
	};

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
                draw.set(geojsonData);

				const features = draw.getAll().features
				handleUpdateDrawnFeatures(features);

				setSelectedFile(null);
				stopRotation();
				zoomToBounds(map, features);

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
			borderWidth: 0.5,
			flex: 1,
			borderStyle: "dashed",
			borderColor: theme.palette.text.secondary,
			borderRadius: 2,
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
				Upload Data
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
			</FormControl >
			<Box
				sx={{
					display: "flex",
					flexDirection:"row",
					mt: 2
				}}
			>
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
						mr: 1,
						flex: 2
                    }}
                >
                    {selectedFile ? selectedFile.name : "BROWSE"}
                </Button>
                <Button
                    variant="contained"
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    sx={{
                        height: 36,
						flex: 3
                    }}
                >
                    Upload
                </Button>
			</Box>
			<Backdrop
				sx={{ 
					color: theme.palette.text.primary,
					backdropFilter: "blur(1px)",
					zIndex: 1,
					position: 'absolute',
					m: 0, 
					p: 0, 
					width: '100%',
					height: '100%',
					borderRadius: 3,
				}}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Box>
	);
} 

export default MapControlsUpload;