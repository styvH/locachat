import React, { useState, useEffect } from 'react';
import './SignupForm.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function SignupForm({onClose, onSwitchToSignIn}) {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    pseudo: '',
    mail: '',
    password: '',
    confirmPassword: '',
  });

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const userId = Cookies.get('userId');
    // Si l'ID utilisateur existe dans les cookies, rediriger vers le tableau de bord
    if (userId) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrorMessage('');

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      // Gérer l'erreur ici (par exemple, afficher un message d'erreur à l'utilisateur)
      console.error('Les mots de passe ne correspondent pas.');
      setErrorMessage('Les mots de passe ne correspondent pas.'); // Exemple simple d'alerte
      return; // Stop la fonction si les mots de passe ne correspondent pas
    }
  
    // Si les mots de passe correspondent, procéder à l'envoi des données
    fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pseudo: formData.pseudo, // Assurez-vous que le serveur gère également ce champ
        mail: formData.mail,
        password: formData.password,
        // Ne pas envoyer confirmPassword au serveur
      }),
    })
    .then((response) => {
      if (response.ok) {



        if (response.status === 201) { // Connexion réussie
          console.log("Utilisateur créé avec succès");

          setSuccessMessage('Nouveau compte utilisateur créé avec succès.');
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/signin');
          }, 3000); // Redirection après 3 secondes

          return null;
        } else {
          throw new Error("Erreur lors de la création du compte.");
        }


      } else if (response.status === 409) {
        throw new Error('Pseudo ou mail existe déjà.');
      } else {
        throw new Error('Une erreur est survenue lors de la création du compte.');
      }
    })
      .catch((error) => {
        console.error('Erreur:', error);
        if (error.message === 'Failed to fetch') {
          setErrorMessage('Échec de la connexion au serveur. \n Vérifiez votre connexion ou rééssayez plus tard.');
        } else {
          setErrorMessage(error.message);
        }
      });
  };
  
  // Ferme le modal lorsque l'utilisateur clique en dehors du formulaire
  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="signin-form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Inscription</h2> 
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
          <div className="form-control">
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              id="pseudo"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="mail">Mail</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
            {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <button type="submit" className="submit-btn">
            Inscription
          </button>
          <div className="form-footer">
            <p>
              Déjà inscrit ? <span onClick={onSwitchToSignIn} className="link-like-button">Connectez-vous ici</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
