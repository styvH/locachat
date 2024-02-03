import React from 'react';
import './App.css';
import MapComponent from './MapComponent';

function App() {
  return (
    <div className="App">
      {/* Barre de navigation en haut */}
      <div className="navbar">
  <div className="logo">Locasite </div>
  <div>
    <a href="/signin" className="sign-in-btn">Connexion</a>
    <a href="/signup" className="sign-up-btn">Inscription</a>
  </div>
</div>

      <MapComponent />
    </div>
  );
}

export default App;
