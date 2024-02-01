import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importez le CSS de Leaflet

const MapComponent = () => {
  const position = [16.265, -61.551]; // Coordonnées centrées sur la Guadeloupe

  return (
    <MapContainer center={position} zoom={10} style={{ height: "100vh", width: "100vw" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Guadeloupe
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
