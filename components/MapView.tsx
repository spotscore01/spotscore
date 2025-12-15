"use client";

import { MapContainer, TileLayer } from "react-leaflet";

const center: [number, number] = [47.4979, 19.0402]; // Budapest

export default function MapView() {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
