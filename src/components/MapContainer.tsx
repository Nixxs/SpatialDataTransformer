import { FC, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const MapContainer: FC = () => {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const map = useRef<mapboxgl.Map | null>(null);

	useEffect(() => {
		if (map.current || !mapContainer.current) return; // Initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			center: [-74.5, 40], // starting position [lng, lat]
			zoom: 2, // starting zoom
		});
	});

	return (
		<div
			style={{
				height: "100%",
				borderRadius: 6
			}}
			ref={mapContainer}
			className="map-container"
		/>
	);
};

export default MapContainer;
