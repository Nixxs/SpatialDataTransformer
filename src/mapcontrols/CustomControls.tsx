import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createRoot } from 'react-dom/client';
import React from 'react';

class ClearAll implements mapboxgl.IControl {
    private container: HTMLElement | undefined;
	private root: ReturnType<typeof createRoot> | undefined;
	private draw: MapboxDraw;

	constructor(draw: MapboxDraw) {
        this.draw = draw;
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
        console.log('clear-all control clicked!');
        // Log all features
        const allFeatures = this.draw.getAll();
        console.log('All drawn features:', allFeatures);

        // Log feature count
        console.log('Number of features:', allFeatures.features.length);

        // Log each feature individually
        allFeatures.features.forEach((feature, index) => {
            console.log(`Feature ${index + 1}:`, feature);
        });

		this.draw.deleteAll();
    }
}

export {ClearAll};