require('dotenv').config();

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(error => {
  if (error) throw error;
  console.log('Connexion à la base de données réussie.');
});

// Fonction pour créer la table `site` si elle n'existe pas
const createSiteTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS site ( 
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom_du_type VARCHAR(255) DEFAULT 'Divers',      
      nom_du_site VARCHAR(255) NOT NULL,
      code_postal VARCHAR(10),
      commune VARCHAR(255),
      voie VARCHAR(255),
      adresse_complete TEXT,
      latitude VARCHAR(20),
      longitude VARCHAR(20),
      site_internet VARCHAR(255),
      description TEXT
    )`;
  
  return new Promise((resolve, reject) => {
    connection.query(createTableQuery, (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log("Table `site` créée ou existante.");
        resolve(results);
      }
    });
  });
};

// Fonction pour créer la table `commenter` si elle n'existe pas
const createCommenterTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS commenter (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      site_id INT NOT NULL,
      note INT NOT NULL,
      commentaire TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;
  
  return new Promise((resolve, reject) => {
    connection.query(createTableQuery, (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log("Table `commenter` créée ou existante.");
        resolve(results);
      }
    });
  });
};

// Fonction pour créer la table `users` si elle n'existe pas
const createUsersTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pseudo VARCHAR(255) NOT NULL,
      mail VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      access_right INT NOT NULL DEFAULT 0
    )`;
  
  return new Promise((resolve, reject) => {
    connection.query(createTableQuery, (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log("Table `users` créée ou existante.");
        resolve(results);
      }
    });
  });
};

// Fonction principale pour créer toutes les tables
const initDatabase = async () => {
  try {
    await createSiteTable();
    await createCommenterTable();
    await createUsersTable();
    console.log("Toutes les tables ont été créées ou vérifiées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la création des tables :", error);
  } finally {
    connection.end();
  }
};

initDatabase();
