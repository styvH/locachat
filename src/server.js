require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.API_PORT;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.get('/api/positions', (req, res) => {
  connection.query('SELECT id, latitude, longitude, nom_du_site, nom_du_type, code_postal, commune, voie, adresse_complete, description, site_internet FROM site', (err, results) => {
    if (err) throw err;
    res.json(results.map(r => ({
      id: r.id,
      position: [parseFloat(r.latitude), parseFloat(r.longitude)],
      nomDuSite: r.nom_du_site,
      nomDuType: r.nom_du_type,
      codePostal: r.code_postal,
      commune: r.commune,
      voie: r.voie,
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
          // Préparer les données de l'utilisateur à envoyer, exclure le mot de passe
          const userData = {
            id: user.id,
            mail: user.mail,
            pseudo: user.pseudo, // Supposons que l'utilisateur a un pseudo
            access_right: user.access_right // Supposons que l'utilisateur a des droits d'accès définis
          };

          // Envoyer les données de l'utilisateur en réponse
          res.status(200).json({
            message: 'User logged in successfully',
            user: userData
          });
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

// Route pour ajouter un commentaire
app.post('/api/comment', (req, res) => {
  const { userId, siteId, comment, rating } = req.body;

  const query = `INSERT INTO commenter (user_id, site_id, note, commentaire) VALUES (?, ?, ?, ?)`;

  connection.query(query, [userId, siteId, rating, comment], (error, results) => {
    if (error) {
      console.error('Erreur lors de l\'insertion du commentaire:', error);
      res.status(500).send('Erreur lors de l\'ajout du commentaire');
    } else {
      console.log('Commentaire ajouté avec succès:', results);
      res.send({ message: 'Commentaire ajouté avec succès', id: results.insertId });
    }
  });
});

app.get('/api/comments/:siteId', (req, res) => {
  const { siteId } = req.params; // Récupération de l'ID du site depuis les paramètres de l'URL

  const query = `
    SELECT commenter.id, commenter.user_id, commenter.site_id, commenter.note, commenter.commentaire, commenter.created_at, users.pseudo
    FROM commenter
    JOIN users ON commenter.user_id = users.id
    WHERE commenter.site_id = ?
    ORDER BY commenter.created_at DESC
  `;

  connection.query(query, [siteId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des commentaires:', err);
      return res.status(500).send('Erreur lors de la récupération des commentaires');
    }

    // Transformation des résultats en un format plus convivial si nécessaire
    const comments = results.map(comment => ({
      id: comment.id,
      userId: comment.user_id,
      siteId: comment.site_id,
      rating: comment.note,
      comment: comment.commentaire,
      createdAt: comment.created_at,
      userPseudo: comment.pseudo // Inclure le pseudo de l'utilisateur si joint avec la table des utilisateurs
    }));

    res.json(comments);
  });
});


app.get('/api/rating/average/:siteId', (req, res) => {
  const { siteId } = req.params;

  const query = `
    SELECT
      COUNT(commenter.id) AS numberOfReviews,
      AVG(commenter.note) AS averageRating
    FROM commenter
    WHERE commenter.site_id = ?
  `;

  connection.query(query, [siteId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de la moyenne des notes:', err);
      return res.status(500).send('Erreur lors de la récupération de la moyenne des notes');
    }

    // S'assurer que le résultat est non nul et a au moins une ligne
    if (results.length > 0) {
      const { numberOfReviews, averageRating } = results[0];
      res.json({
        siteId: siteId,
        numberOfReviews: numberOfReviews,
        averageRating: averageRating ? parseFloat(averageRating).toFixed(2) : 0 // Formatte la moyenne à deux décimales, gère les cas sans avis
      });
    } else {
      res.json({
        siteId: siteId,
        numberOfReviews: 0,
        averageRating: 0
      });
    }
  });
});


app.post('/api/addSite', (req, res) => {
  const { nomDuJardin, codePostal, region, departement, adresseComplete, latitude, longitude, siteInternet, description } = req.body;
  const query = 'INSERT INTO site (nom_du_jardin, code_postal, region, departement, adresse_complete, latitude, longitude, site_internet, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  connection.query(query, [nomDuJardin, codePostal, region, departement, adresseComplete, latitude, longitude, siteInternet, description], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du site', err);
      res.status(500).send('Erreur lors de l\'ajout du site');
    } else {
      res.status(201).send('Site ajouté avec succès');
    }
  });
});

app.put('/api/editUser/:id', (req, res) => {
  const { id } = req.params;
  const { accessRight } = req.body;

  if (!accessRight) {
    return res.status(400).send('Les droits d\'accès sont requis.');
  }

  const query = 'UPDATE users SET access_right = ? WHERE id = ?';

  connection.query(query, [accessRight, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la modification des droits d\'accès', err);
      return res.status(500).send('Erreur lors de la modification des droits d\'accès.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }
    res.status(200).send('Droits d\'accès modifiés avec succès.');
  });
});

app.get('/api/users', (req, res) => {
  connection.query('SELECT id, pseudo, access_right FROM users', (err, results) => {
    if (err) throw err;
    res.json(results.map(r => ({
      id: r.id,
      pseudo: r.pseudo,
      accessRight: r.access_right,
    })));
  });
});

app.delete('/api/deleteUser/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur', err);
      return res.status(500).send('Erreur lors de la suppression de l\'utilisateur.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }
    res.status(200).send('Utilisateur supprimé avec succès.');
  });
});

app.delete('/api/deleteSite/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM site WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du site', err);
      return res.status(500).send('Erreur lors de la suppression du site.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Site non trouvé.');
    }
    res.status(200).send('Site supprimé avec succès.');
  });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
