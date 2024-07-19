import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Feature } from "geojson";

class ClearAll implements mapboxgl.IControl {
    private container: HTMLElement | undefined;
	private root: ReturnType<typeof createRoot> | undefined;
	private draw: MapboxDraw;
	private updateDrawnFeatures: (features: Feature[]) => void;

	constructor(draw: MapboxDraw, updateDrawnFeatures: (features: Feature[]) => void) {
        this.draw = draw;
		this.updateDrawnFeatures = updateDrawnFeatures
    }

    onAdd() {
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group clear-all-container';
        
        const button = document.createElement('button');
        button.className = 'clear-all-button';
        button.type = 'button';
        button.setAttribute('title', 'Clear All');

		const iconContainer = document.createElement('div');
        iconContainer.className = 'clear-all-icon';
        
        // Create a root and render the MUI icon
        this.root = createRoot(iconContainer);
        this.root.render(React.createElement(DeleteOutlineIcon));
        
        button.appendChild(iconContainer);
        button.onclick = this.onClick.bind(this);

        this.container.appendChild(button);
        return this.container;
    }

    onRemove() {
        if (this.root) {
            this.root.unmount();
            this.root = undefined;
        }
        if (this.container) {
            this.container.parentNode?.removeChild(this.container);
        }
    }

    onClick() {
		this.draw.deleteAll();
		this.updateDrawnFeatures([]);
    }
}

export {ClearAll};