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
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { FC, useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Feature } from "geojson";
import axios from "axios";

type MapControlExportProps = {
	activeFeatures: Feature[],
	handleSetErrorMessage: (message:string | null) => void
}

const MapControlsExport:FC<MapControlExportProps>= ({activeFeatures, handleSetErrorMessage}) => {
	const {theme} = useContext(ThemeContext);
	const [outputFormat, setOutputFormat] = useState<string>("shp");
	const [outputCRS, setOutputCRS] = useState<number | null>(4326);
	const [loading, setLoading] = useState<boolean>(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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

	const handleExport = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": activeFeatures
			},
			"output_format": outputFormat,
			"output_crs": `EPSG:${outputCRS}`
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
                        },
						responseType: "blob"
                    }
                );
                if (response.status === 200) {
                    const url = window.URL.createObjectURL(response.data);
					setDownloadUrl(url);
					handleSetErrorMessage(null);
                } 
            } catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					// Handle Axios errors
					const errorResponse = error.response;
					try {
						// Convert blob to text
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

	const handleDownload = () => {
		if (downloadUrl) {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			let fileExtension;
			switch (outputFormat) {
				case 'shp':
					fileExtension = 'zip';
					break;
				case 'gpkg':
					fileExtension = 'gpkg';
					break;
				case 'dxf':
					fileExtension = 'dxf';
					break;
				default:
					fileExtension = outputFormat;
			}
			
			const fileName = `geoflip_${timestamp}.${fileExtension}`;
	
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
			setDownloadUrl(null);
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
				mt: 2,
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

			</FormControl >
			<Box 
				sx={{
					mt: 2,
					flexDirection: "row",
					display: "flex"
				}}
			>
				<Button
					variant="outlined"
					onClick={handleExport}
					sx={{
						flex: 1,
						height: 35,
						minWidth: 80
					}}
				>
					export
				</Button>
				<Button
					variant="contained"
					onClick={handleDownload}
					fullWidth
					disabled={downloadUrl ? false : true}
					sx={{
						height: 35,
						ml: 1
					}}
				>
					Download
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

export default MapControlsExport;