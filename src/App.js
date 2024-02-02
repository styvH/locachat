import React from 'react';
import './App.css';
import MapComponent from './MapComponent';

function App() {
  const initializeData = () => {
    console.log('Initialisation des données...');
    // Ajoutez ici votre logique pour initialiser les données, comme une requête API
  };

  return (
    <div className="App">
      <button className="initialization-btn" onClick={initializeData}>Initialiser les Données</button>
      <MapComponent />
    </div>
  );
}

export default App;
