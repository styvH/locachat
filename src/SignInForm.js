import React, { useState } from 'react';
import './SignInForm.css';

function SignInForm() {
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
    console.log(formData);
    // Logique de connexion ici
  };

  return (
    <div className="signin-form-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2> {/* Titre avec espace */}
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
