import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/positions');
        setPositions(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des positions:', error);
      }
    };

    fetchPositions();
  }, []);
/** @todo => Ajouter barre de recherche avec liste déroulante sur le côté
 * Affichant la liste des lieux existants 
 * Utilise positions.map(site, index) => (...) ajoutes-y site.nomDuJardin (évoluera plus tard)
 */
  return (
    <MapContainer center={[16.265, -61.551]} zoom={10} style={{ height: "100vh", width: "100vw" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {positions.map((site, index) => (
        <Marker key={index} position={site.position}>
          <Popup>
            <b>{site.nomDuSite}</b><br/>
            {site.nomDuType}<br/>
            {
    site.adresseComplete ?
    <div>{site.adresseComplete}</div> :
    <>
      {site.codePostal && <div>{site.codePostal}</div>}
      {site.commune && <div>{site.commune}</div>}
      {site.voie && <div>{site.voie}</div>}
    </>
  }

            {site.description}<br/>
            {site.siteInternet ? <a href={site.siteInternet} target="_blank" rel="noopener noreferrer">Site Web</a> : ''}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
