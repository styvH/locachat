import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import SignupForm from './SignupForm';
import SignInForm from './SignInForm'; 
import './navbar.css';


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

  const handleSwitchToSignUp = () => {
    closeSigninModal();
    openSignupModal();
  }
  const handleSwitchToSignIn = () => {
    closeSignupModal();
    openSigninModal();
  }

  return (
    <div className="navbar">
      <Link to="/" className="logo">Locasite</Link> 
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

            
            {showSignupModal && (
                <SignupForm onClose={closeSignupModal} onSwitchToSignIn={handleSwitchToSignIn}/>
            )}

            
            {showSigninModal && (
                <SignInForm onClose={closeSigninModal} onSwitchToSignUp={handleSwitchToSignUp}/>
            )}
    </div>

  );
}

export default Navbar;
