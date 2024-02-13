const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'locasite'
});

app.get('/api/positions', (req, res) => {
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

/* Route d'inscription */

app.post('/api/signup', async (req, res) => {
  const { pseudo, mail, password } = req.body;
  const saltRounds = 10;

  // Vérifier si le mail ou le pseudo existe déjà
  const checkQuery = 'SELECT * FROM users WHERE mail = ? OR pseudo = ?';

  connection.query(checkQuery, [mail, pseudo], async (err, result) => {
    if (err) {
      console.error('Error querying the database', err);
      return res.status(500).send('Error checking user existence');
    }

    if (result.length > 0) {
      // Mail ou pseudo existe déjà
      return res.status(409).send('Mail or pseudo already exists');
    } else {
      // Aucun utilisateur existant avec ce mail ou pseudo, procéder à la création

      try {
        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insérer l'utilisateur avec le mot de passe hashé dans la base de données
        const insertQuery = 'INSERT INTO users (pseudo, mail, password) VALUES (?, ?, ?)';
        connection.query(insertQuery, [pseudo, mail, hashedPassword], (error, results) => {
          if (error) {
            console.error('Error inserting data', error);
            return res.status(500).send('Error creating new user');
          } else {
            return res.status(201).send('User created successfully');
          }
        });
      } catch (error) {
        console.error('Hashing error', error);
        return res.status(500).send('Server error');
      }
    }
  });
});


/* Route de connexion */
app.post('/api/signin', (req, res) => {
  const { mail, password } = req.body;
  const query = 'SELECT * FROM users WHERE mail = ?';

  connection.query(query, [mail], async (err, results) => {
    if (err) {
      console.error('Error querying database', err);
      return res.status(500).send('Error during sign in');
    } else {
      if (results.length > 0) {
        const user = results[0];
        // Utiliser bcrypt.compare pour comparer le mot de passe fourni avec le hash stocké
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // Le mot de passe correspond
          res.status(200).send('User logged in successfully');
        } else {
          // Le mot de passe ne correspond pas
          res.status(401).send('Incorrect email or password');
        }
      } else {
        // Aucun utilisateur trouvé avec cet email
        res.status(401).send('Incorrect email or password');
      }
    }
  });
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
