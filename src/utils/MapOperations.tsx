import * as turf from '@turf/turf';
import mapboxgl from "mapbox-gl";
import { Feature } from "geojson";

const zoomToBounds = (map: mapboxgl.Map | null, features: Feature[]) => {
	// Fit map to the extent of the new features using Turf.js
	if (map && features.length > 0) {
		const featureCollection = turf.featureCollection(features);
		const bbox = turf.bbox(featureCollection);
		const bounds = new mapboxgl.LngLatBounds(
			[bbox[0], bbox[1]],
			[bbox[2], bbox[3]]
		);

		// the mapbox type for fitbounds seems to conflict with typescript
		map.fitBounds(bounds, {
			padding: 50,
			maxZoom: 15,
			duration: 5000 
		} as any);
	}
}

export {zoomToBounds}