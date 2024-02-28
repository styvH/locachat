import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';

function Navbar() {
  const location = useLocation();
  const userPseudo = Cookies.get('userPseudo');
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/signin';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="navbar">
      <Link to="/" className="logo">Locasite</Link> {/* Cliquez sur le logo pour revenir à l'accueil */}
      {!hideNavbar && (
        <div>
          {userPseudo ? (
            <div className="dropdown">
              <button className="dropbtn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {userPseudo}
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/dashboard">Tableau de bord</Link>
                  <LogoutButton />
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
      )}
    </div>
  );
}

export default Navbar;
