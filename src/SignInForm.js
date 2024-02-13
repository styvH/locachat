import React, { useState } from 'react';
import './SignInForm.css';
import { useNavigate } from 'react-router-dom';


function SignInForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    mail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: formData.mail,
        password: formData.password,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          
          if (response.status === 200) { // Connexion réussie
            console.log("Utilisateur créé avec succès");
  
            setSuccessMessage('Connexion réussie...');
            setTimeout(() => {
              setSuccessMessage('');
              navigate('/');
            }, 3000); // Redirection après 3 secondes
  
            return null;
          } else {
            throw new Error("Email ou Mot de passe incorrect.");
          }


        } else {
          throw new Error('Echec de connexion');
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

  return (
    <div className="signin-form-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2> {/* Titre avec espace */}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
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
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="submit-btn">
          Connexion
        </button>
        <div className="form-footer">
          <p>
            Pas encore inscrit ? <a href="/signup">Inscrivez-vous ici</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
