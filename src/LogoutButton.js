import React from 'react';
import './LogoutButton.css';
import Cookies from 'js-cookie';

function LogoutButton() {

  const handleLogout = () => {
    // Supprime les cookies ou tout autre stockage local utilisé pour la session
    Cookies.remove('userId');
    Cookies.remove('userMail');
    Cookies.remove('userPseudo');
    Cookies.remove('userAccessRight');

    // Rafraîchit la page pour forcer la mise à jour de l'interface utilisateur
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className='logout-button'>Déconnexion</button>
  );
}

export default LogoutButton;
