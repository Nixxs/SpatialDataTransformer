import { 	
	Box,
	Button
} from "@mui/material";
import { FC, Dispatch, SetStateAction  } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Feature } from "geojson";
import { zoomToBounds } from "../../utils/MapOperations";
import axios from "axios";

type UnionTransformProps = {
	map: mapboxgl.Map | null,
	draw: MapboxDraw,
	activeFeatures: Feature[],
	setLoading: Dispatch<SetStateAction<boolean>>,
	handleSetErrorMessage: (message:string | null) => void,
	handleUpdateDrawnFeatures: (features: Feature[]) => void,
	stopRotation: () => void
}

const UnionTransform:FC<UnionTransformProps> = ({map, draw, activeFeatures, setLoading, handleSetErrorMessage, handleUpdateDrawnFeatures, stopRotation}) => {
	const handleApplyUnion = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": activeFeatures
			},
			"output_format": "geojson",
			"transformations":[
				{
					"type":"union"
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
			<Button
				variant="contained"
				disabled={activeFeatures.length > 0 ? false : true}
				fullWidth
				onClick={handleApplyUnion}
			>
				Apply Union <ArrowRightIcon />
			</Button>
		</Box>
	);
}

export default UnionTransform;

