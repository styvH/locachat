import React, { useState } from 'react';
import './App.css';
import MapComponent from './MapComponent';
import SignupForm from './SignupForm';
import SignInForm from './SignInForm'; 
import Dashboard from './Dashboard';
import LogoutButton from './LogoutButton';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';


function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userPseudo = Cookies.get('userPseudo'); // Lire le pseudo de l'utilisateur à partir des cookies
  
  return (
    <Router>
      <div className="App">
        <div className="navbar">
          <Link to="/" className="logo">Locasite</Link> {/* Cliquez sur le logo pour revenir à l'accueil */}
          <div>
            {userPseudo ? (
              <div className="dropdown">
                <button className="dropbtn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {userPseudo}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/dashboard">Tableau de bord</Link>
                    <LogoutButton /> {/* Utiliser le nouveau composant ici */}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="sign-in-btn">Connexion</Link>
                <Link to="/signup" className="sign-up-btn">Inscription</Link>
              </>
            )}
          </div>
        </div>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/" element={<MapComponent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
