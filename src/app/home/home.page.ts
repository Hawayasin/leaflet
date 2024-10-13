import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  tileLayers: { [key: string]: L.TileLayer } = {}; // Use an object to store tile layers
  currentLayer!: L.TileLayer;
  currentMarker: L.Marker | null = null; // Store the current marker

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.map = L.map('mapId').setView([-7.83911216341575, 110.54560303523635], 13); // Center landing page

    // OSM Base map
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Satellite Base map
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Dark-themed base map (Stadia Black)
    const stadiaBlack = L.tileLayer('https://stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
    });

    // Terrain Base map
    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    });

    // Store tile layers in the object for easy access
    this.tileLayers = {
      "OpenStreetMap": osm,
      "Satellite": satellite,
      "Terrain": terrain,
      "Stadia Black": stadiaBlack
    };

    // Set default base map
    this.currentLayer = osm.addTo(this.map); // Default basemap

    // Layer control for base maps
    L.control.layers(this.tileLayers).addTo(this.map);

    // Handle map click to add markers
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      // Remove the previous marker if it exists
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      // Create a custom marker with FontAwesome icon and popupAnchor adjustment
      const icon = L.divIcon({
        html: '<i class="fa-solid fa-location-dot fa-2x" style="color:blue"></i>',  // FontAwesome icon
        className: 'custom-div-icon',
        iconAnchor: [9, 42], // Anchor point of the marker (center bottom)
        popupAnchor: [0, -45], // Popup appears above the marker (adjust as needed)
      });

      // Add the custom marker to the map
      this.currentMarker = L.marker([lat, lng], { icon })
        .addTo(this.map)
        .bindPopup(`<b>This location in :</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();
    });
  }

  onBasemapChange(event: any) {
    const selectedLayer = event.detail.value;

    // Remove the current layer and add the selected one
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    this.currentLayer = this.tileLayers[selectedLayer];
    this.currentLayer.addTo(this.map);
  }
}
