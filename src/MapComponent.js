import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './MapComponent.css';
import RatingStars from "./RatingStars";

// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FilterPanel = ({ types, selectedTypes, handleTypeSelection, handleDeselectAll }) => {
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
      <button onClick={handleDeselectAll} style={{ marginBottom: '10px' }}>Tout désélectionner</button>
    </div>
  );
};


const MapComponent = () => {
  const [positions, setPositions] = useState([]);
  const mapRef = useRef(null);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/positions');
        setPositions(response.data);

        // Centrer la carte au milieu après le chargement des positions
        if (mapRef.current) {
          mapRef.current.flyTo([16.265, -61.551], 10);
        }

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

  
  const handleDeselectAll = () => {
    setSelectedTypes([]); // Réinitialise les types sélectionnés
  };

  // Gestion de la sélection des types
  const handleTypeSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedTypes(prev => 
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <div>
      <MapContainer center={[16.265, -61.551]} zoom={10} style={{ height: "calc(100vh - 100px)", width: "calc(100vw - 100px)", position: "fixed", top: "80px", left: "50px" }} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
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
              <hr />
              {/* Section Commentaire et Avis */}
              <div className="comment-section">
                <h4>Commentaires et Avis</h4>
                {/* Exemple de commentaires existants (devraient être récupérés depuis une base de données) */}
                <div className="comments">
                  <p>"Superbe visite, à recommander !" - <strong>5 étoiles</strong></p>
                  <p>"Joli mais un peu bondé." - <strong>4 étoiles</strong></p>
                </div>
                {/* Section pour ajouter un nouveau commentaire */}
                <div className="add-comment">
                  <RatingStars onRating={(rate) => console.log(rate)} />
                  <textarea placeholder="Votre commentaire..."></textarea>
                  <button type="button">Envoyer</button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FilterPanel
          types={types}
          selectedTypes={selectedTypes}
          handleTypeSelection={handleTypeSelection}
          handleDeselectAll={handleDeselectAll} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
