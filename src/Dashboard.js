import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/positions') // Assurez-vous que l'URL correspond à votre configuration de serveur
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Liste des Sites</h2>
      <table>
        <thead>
          <tr>
            <th>Nom du Jardin</th>
            <th>Région</th>
            <th>Adresse</th>
            <th>Description</th>
            <th>Site Internet</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => (
            <tr key={index}>
              <td>{position.nomDuJardin}</td>
              <td>{position.region}</td>
              <td>{position.adresseComplete}</td>
              <td>{position.description}</td>
              <td><a href={position.siteInternet} target="_blank" rel="noopener noreferrer">Visiter</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
