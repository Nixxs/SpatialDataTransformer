import { FC, useRef, useEffect } from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {ClearAll} from "../mapcontrols/CustomControls";
import "../mapcontrols/CustomControls.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

type MapContainerProps = {
	centrePosition: LngLat;
	setCentrePosition: (position: LngLat) => void;
	draw: MapboxDraw;
};

const MapContainer: FC<MapContainerProps> = ({centrePosition, setCentrePosition, draw}) => {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const rotationInterval = useRef<number | null>(null);

	useEffect(() => {
		if (map.current || !mapContainer.current) return; // Initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			center: centrePosition, // starting position [lng, lat]
			zoom: 2, // starting zoom
			style: "mapbox://styles/mapbox/streets-v12",
		});

		map.current.on("style.load", () => {
			if (map.current) {
				map.current.setFog({
					color: "#b3c8e3", // dark blue color
					"high-color": "#36414f",
					"horizon-blend": 0.02,
					"space-color": "#14181f",
				});
			}
		});

		map.current.on("load", () => {
			startRotation();

            if (map.current && draw) {
                map.current.addControl(draw as unknown as mapboxgl.IControl, 'top-left');
				map.current.addControl(new ClearAll(draw), 'top-left');
            }
		});

		map.current.on("mousedown", stopRotation);
		map.current.on("touchstart", stopRotation);
		map.current.on("move", () => {
			if (map.current) {
				const currentCenter = map.current.getCenter();
				setCentrePosition(currentCenter);
			}
		});

		return () => {
			stopRotation();
		};
	}, [draw]);

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

	return (
		<div
			style={{
				height: "100%",
				borderRadius: 12,
			}}
			ref={mapContainer}
			className="map-container"
		/>
	);
};

export default MapContainer;
