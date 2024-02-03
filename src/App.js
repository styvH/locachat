import React from 'react';
import './App.css';
import MapComponent from './MapComponent';
import SignupForm from './SignupForm';
import SignInForm from './SignInForm'; // Importez le nouveau composant
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="navbar">
          <Link to="/" className="logo">Locasite</Link> {/* Cliquez sur le logo pour revenir à l'accueil */}
          <div>
            <Link to="/signin" className="sign-in-btn">Connexion</Link>
            <Link to="/signup" className="sign-up-btn">Inscription</Link>
          </div>
        </div>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
