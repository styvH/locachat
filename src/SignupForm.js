import React, { useState } from 'react';
import './SignupForm.css';

function SignupForm() {
  const [formData, setFormData] = useState({
    pseudo: '',
    mail: '',
    password: '',
    confirmPassword: '',
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
    console.log(formData);
    // Logique d'inscription ici
  };

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Inscription</h2> {/* Titre avec espace */}
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
        <button type="submit" className="submit-btn">
          Inscription
        </button>
        <div className="form-footer">
          <p>
            Déjà inscrit ? <a href="/signin">Connectez-vous ici</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
