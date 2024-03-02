import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import SignupForm from './SignupForm';
import SignInForm from './SignInForm'; 


function Navbar() {
  const location = useLocation();
  const userPseudo = Cookies.get('userPseudo');
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/signin';
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);

  const openSignupModal = () => setShowSignupModal(true);
  const closeSignupModal = () => setShowSignupModal(false);
  const openSigninModal = () => setShowSigninModal(true);
  const closeSigninModal = () => setShowSigninModal(false);

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
              <button onClick={openSigninModal} className="sign-in-btn">Connexion</button>
              <button onClick={openSignupModal} className="sign-up-btn">Inscription</button>
            </>
          )}
        </div>
      )}

            {/* Modal for Signup */}
            {showSignupModal && (
                <SignupForm onClose={closeSignupModal}/>
            )}

            {/* Modal for Signin */}
            {showSigninModal && (
                <SignInForm onClose={closeSigninModal} />
            )}
    </div>

  );
}

export default Navbar;
