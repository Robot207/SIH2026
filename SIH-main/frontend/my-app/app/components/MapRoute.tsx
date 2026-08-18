"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing marker icons in leaflet with next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapRoute({ origin, dest }: { origin: [number, number], dest: [number, number] }) {
  
  // Calculate bounds to fit both markers
  const bounds = L.latLngBounds(origin, dest);

  return (
    <div style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <MapContainer 
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Origin Marker */}
        <Marker position={origin} icon={icon}>
          <Popup>Origin Vendor</Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={dest} icon={icon}>
          <Popup>Destination Hospital</Popup>
        </Marker>

        {/* Route Line */}
        <Polyline 
          positions={[origin, dest]} 
          color="#3b82f6" 
          weight={4}
          dashArray="10, 10"
        />
      </MapContainer>
    </div>
  );
}
