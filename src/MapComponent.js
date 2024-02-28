import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './MapComponent.css';

// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FilterPanel = ({ types, selectedTypes, handleTypeSelection }) => {
  const map = useMap();

  // Positionner le panneau sur la carte
  useEffect(() => {
    L.control({ position: "topright" }).onAdd = () => {
      const div = L.DomUtil.create('div', 'filter-panel');
      L.DomEvent.disableClickPropagation(div);
      return div;
    };
  }, [map]);

  return (
    <div className="filter-panel">
      <h2>Filtres des lieux</h2>
      {types.map(type => (
        <label key={type} className="filter-label">
          <input
            type="checkbox"
            value={type}
            onChange={handleTypeSelection}
            checked={selectedTypes.includes(type)}
          />
          {type}
        </label>
      ))}
    </div>
  );
};


const MapComponent = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/positions');
        setPositions(response.data);
        setFilteredPositions(response.data); // Initialise avec toutes les données
      } catch (error) {
        console.error('Erreur lors de la récupération des positions:', error);
      }
    };

    fetchPositions();
  }, []);

  // Création d'une liste de types uniques pour la sélection
  const types = [...new Set(positions.flatMap(site => site.nomDuType.split(" - ")))];

  // Mise à jour des positions filtrées en fonction des types sélectionnés
  useEffect(() => {
    if (selectedTypes.length > 0) {
      const filtered = positions.filter(site =>
        site.nomDuType.split(" - ").some(type => selectedTypes.includes(type))
      );
      setFilteredPositions(filtered);
    } else {
      setFilteredPositions(positions); // Si aucun type n'est sélectionné, afficher tous les sites
    }
  }, [selectedTypes, positions]);

  // Gestion de la sélection des types
  const handleTypeSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedTypes(prev => 
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <div>
      <MapContainer center={[16.265, -61.551]} zoom={10} style={{ height: "100vh", width: "100vw" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FilterPanel types={types} selectedTypes={selectedTypes} handleTypeSelection={handleTypeSelection} />
        {filteredPositions.map((site, index) => (
          <Marker key={index} position={site.position}>
            <Popup>
              <b>{site.nomDuSite}</b><br/>
              {site.nomDuType}<br/>
              {site.adresseComplete ? <div>{site.adresseComplete}</div> : 
              <>
                {site.codePostal && <div>{site.codePostal}</div>}
                {site.commune && <div>{site.commune}</div>}
                {site.voie && <div>{site.voie}</div>}
              </>}
              {site.description}<br/>
              {site.siteInternet ? <a href={site.siteInternet} target="_blank" rel="noopener noreferrer">Site Web</a> : ''}
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </div>
  );
};

export default MapComponent;
