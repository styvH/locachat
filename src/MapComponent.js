import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function AddMarkerToClick() {
  const [markers, setMarkers] = useState([]);

  useMapEvents({
    click(e) {
      const newMarker = e.latlng;
      setMarkers([...markers, newMarker]);
    },
  });

  return (
    <>
      {markers.map((position, idx) =>
        <Marker key={idx} position={position}>
          <Popup>
            <div className="form-popup">
              <form>
                <div>
                  <label>Nom du lieu:</label>
                  <input type="text" placeholder="Entrez un nom" />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea placeholder="Entrez une description"></textarea>
                </div>
                <button type="button">Sauvegarder</button>
              </form>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

const MapComponent = () => {
  return (
    <MapContainer center={[16.265, -61.551]} zoom={10} style={{ height: "100vh", width: "100vw" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <AddMarkerToClick />
    </MapContainer>
  );
};

export default MapComponent;
