import {Box, Typography} from '@mui/material';
import { ThemeContext } from "./ThemeContext";
import { useContext, useState, useRef, useEffect } from 'react';
import {ClearAll} from "../mapcontrols/CustomControls";
import mapboxgl, { LngLat } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapControls from './MapControls';
import { Feature } from "geojson";
import "../mapcontrols/CustomControls.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const Layout = () => {
	const {theme} = useContext(ThemeContext);
	const [mapCentrePosition, setMapCentrePosition] = useState(new LngLat(0, 0));
	const [activeFeatures, setActiveFeatures] = useState<Feature[]>([]);
	const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
	const rotationInterval = useRef<number | null>(null);
	const drawRef = useRef<MapboxDraw>(new MapboxDraw({
		displayControlsDefault: false,
		controls: {
			polygon: true,
			line_string: true,
			point: true
		}
	}));

	useEffect(() => {
		if (map.current || !mapContainer.current) return; // Initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			center: mapCentrePosition, // starting position [lng, lat]
			zoom: 2, // starting zoom
			style: theme.mapTheme,
		});

		map.current.on("style.load", () => {
			if (map.current) {
				map.current.setFog({
					color: theme.palette.map.fogColor, 
					"high-color": theme.palette.map.fogHighColor,
					"horizon-blend": 0.02,
					"space-color": theme.palette.map.space,
				});
			}
		});

		map.current.on("load", () => {
			startRotation();
            if (map.current && drawRef.current) {
                map.current.addControl(drawRef.current as mapboxgl.IControl, 'top-left');
				map.current.addControl(new ClearAll(drawRef.current, handleUpdateDrawnFeatures), 'top-left');
            }
		});
		
		// doesn't seem to be a proper type for the draw events 
		// so we have to use 'as any' here
		map.current.on('draw.create' as any, updateActiveFeatures);
		map.current.on('draw.delete' as any, updateActiveFeatures);
		map.current.on('draw.update' as any, updateActiveFeatures);

		map.current.on("mousedown", stopRotation);
		map.current.on("touchstart", stopRotation);
		map.current.on("move", () => {
			if (map.current) {
				const currentCenter = map.current.getCenter();
				setMapCentrePosition(currentCenter);
			}
		});

		return () => {
			stopRotation();
		};
	}, [drawRef]);

	const startRotation = () => {
		if (rotationInterval.current) return;

		rotationInterval.current = window.setInterval(() => {
			if (map.current) {
				const currentCenter = map.current.getCenter();
				map.current.easeTo({
					center: [currentCenter.lng + 1, currentCenter.lat],
					duration: 1000,
					easing: (t) => t,
				});
			}
		}, 100);
	};

	const stopRotation = () => {
		if (rotationInterval.current) {
			clearInterval(rotationInterval.current);
			rotationInterval.current = null;
		}
	};

	const updateActiveFeatures = () => {
		const features = drawRef.current.getAll().features as Feature[];
        handleUpdateDrawnFeatures(features);
	};

	const handleUpdateDrawnFeatures = (features: Feature[]) => {
        setActiveFeatures(features);
    };

	return (
		<Box
			sx={{
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				padding: 2,
				height: "100%"
			}}
		>
			<Box
				sx={{
					flex: 0,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: theme.palette.background.paper,
					borderRadius: 3,
					padding: 3
				}}
			>
				<Typography 
					sx={{
						fontWeight: 600,
						fontSize: 32,
						color: theme.palette.text.secondary
					}}
				>
					Spatial Data Transformer
				</Typography>
				<Typography 
					sx={{
						fontWeight: 300,
						fontSize: 18,
						color: theme.palette.text.secondary
					}}
				>
					A <a href="https://account.geoflip.io"><img src={theme.geoflipLogo} width="80px" /></a> Integration Demo
				</Typography>
			</Box>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'row',
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: theme.palette.background.paper,
						borderRadius: 3,
						marginRight: 2,
						marginTop: 2,
						minWidth: 360,
						overflow: "auto",
						'&::-webkit-scrollbar': {
							width: 0,
							height: 0,
						},
						pb: 3
					}}
				>
					{map && (
						<MapControls 
							map={map.current}
							draw={drawRef.current}
							mapCentrePosition={mapCentrePosition}
							activeFeatures={activeFeatures}
							handleUpdateDrawnFeatures={handleUpdateDrawnFeatures}
							stopRotation={stopRotation}
						/>
					)}
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
					<div
						style={{
							height: "100%",
							borderRadius: 12,
						}}
						ref={mapContainer}
						className="map-container"
					/>
				</Box>
			</Box>
		</Box>
	);
}

export default Layout;