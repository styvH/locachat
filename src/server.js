const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors()); // Utilisez CORS pour éviter les problèmes de CORS en développement

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'locasite'
});

app.get('/positions', (req, res) => {
  connection.query('SELECT latitude, longitude, nom_du_jardin, region, adresse_complete, description, site_internet FROM site', (err, results) => {
    if (err) throw err;
    res.json(results.map(r => ({
      position: [parseFloat(r.latitude), parseFloat(r.longitude)],
      nomDuJardin: r.nom_du_jardin,
      region: r.region,
      adresseComplete: r.adresse_complete,
      description: r.description,
      siteInternet: r.site_internet
    })));
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
