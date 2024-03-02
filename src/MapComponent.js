import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './MapComponent.css';
import RatingStars from "./RatingStars";
import Cookies from 'js-cookie';

// Configuration de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



const ExpandableText = ({ text, maxLength = 100 }) => {
  // Gestion des cas où text est null ou undefined
  const displayText = text || ''; // Si text est null ou undefined, utilisez une chaîne vide
  const [isExpanded, setIsExpanded] = useState(false);

  if (displayText.length <= maxLength) {
    return <p>{displayText}</p>;
  }

  return (
    <p>
      {isExpanded ? displayText : `${displayText.substring(0, maxLength)}... `}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ color: 'blue', textDecoration: 'underline', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
      >
        {isExpanded ? 'Voir moins' : 'Voir plus'}
      </button>
    </p>
  );
};


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

  const userId = useState('');
  const [currentComment, setCurrentComment] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [comments, setComments] = useState({});
  
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
  
  const submitComment = async (siteId) => {
    var userId = Cookies.get('userId');
    if (!userId) {
      console.error("L'ID de l'utilisateur n'est pas disponible.");
      return;
    }
    if (!currentComment.trim() || !currentRating) {
      alert("Veuillez entrer un commentaire et sélectionner une note.");
      return;
    }
    
  
    try {
      console.log(userId, siteId, currentRating, currentComment);
      const response = await axios.post('http://localhost:3001/api/comment', {
        userId: userId, // Assurez-vous que l'ID utilisateur est correctement géré
        siteId: siteId,        
        rating: currentRating,
        comment: currentComment,

      });
  
      // Gérer la réponse ici, par exemple, réinitialiser le formulaire
      console.log(response.data.message);
      setCurrentComment('');
      setCurrentRating(0);
    } catch (error) {
      alert('Erreur lors de l\'envoi du commentaire:', error);
    }
  };
  

  const fetchComments = async (siteId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/comments/${siteId}`);
      setComments(prevComments => ({
        ...prevComments,
        [siteId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  
  const fetchRating = async (siteId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/rating/average/${siteId}`);
      setComments(prevComments => ({
        ...prevComments,
        [siteId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  return (
    <div>
      <MapContainer
  center={[16.265, -61.551]}
  zoom={10}
  style={{
    height: 'calc(100vh - 60px)', // Ajuste pour la hauteur de la navbar
    width: '100%',
    position: 'absolute',
    top: '60px', // Démarre juste en dessous de la navbar
    left: '0'
  }}
  zoomControl={false}
>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        {filteredPositions.map((site, index) => (
          <Marker key={index} position={site.position}   
          eventHandlers={{
            popupopen: () => fetchComments(site.id),
          }}>
              <Popup>
                <div className="popup-content">
                  <div className="popup-header">
                    <b>{site.nomDuSite}</b><br />
                    {site.nomDuType}<br />
                    <hr/>
                    {site.adresseComplete ? (
                      <div>{site.adresseComplete}</div>
                    ) : (
                      <>
                        {site.voie && <div>{site.voie}</div>}
                        {site.commune && <div>{site.commune}</div>}
                        {site.codePostal && <div>{site.codePostal}</div>}
                      </>
                    )}
                    {site.description && <hr/>}
                    {site.description && (
                        <div className="description-content">
                          <ExpandableText text={site.description} maxLength={100} />
                        </div>
                      )}

                    
                    {site.siteInternet ? (
                      <a href={site.siteInternet} target="_blank" rel="noopener noreferrer">
                        Site Web
                      </a>
                    ) : ''}
                    <hr />
                  </div>
                  {/* Section Commentaire et Avis reste fixe et toujours visible */}
                  <div className="comment-section">
                    <h4>Commentaires et Avis</h4>
                      <div className="comments">
                          {comments[site.id] && comments[site.id].length > 0 ? (
                            comments[site.id].map(comment => (
                              <div key={comment.id} className="comment">
                                <p><strong>{comment.userPseudo}</strong> - {new Date(comment.createdAt).toLocaleDateString()} - Note: {comment.rating} <span className="star">&#9733;</span></p>
                                <div>
                                <span></span>
                                  <span>{comment.comment}</span>
                                </div>
                                <p className="comment-date"></p>
                              </div>
                            ))
                          ) : (
                            <p>Aucun commentaire pour ce site.</p>
                          )}
                        </div>
                        <hr/>
                    <div className="add-comment">
                    <RatingStars
                      rating={currentRating}
                      onRating={setCurrentRating} />
                    <textarea
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                      placeholder="Votre commentaire..."
                    ></textarea>
                      <button type="button" onClick={() => submitComment(site.id)}>Envoyer</button>
                    </div>
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
