const mysql = require('mysql');
const axios = require('axios');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'locasite'
});

// Fonction pour créer la table `site` si elle n'existe pas
const createTableIfNotExists = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS site ( 
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom_du_type VARCHAR(255),      
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

const fetchData = async () => {
  try {
    const response = await axios.get('https://www.karudata.com/api/explore/v2.1/catalog/datasets/les-lieux-remarquables-de-la-guadeloupe/records?limit=100');
    const sites = response.data.results;
    return sites;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de l\'API:', error);
    return [];
  }
};


const insertDataIntoDB = (sites) => {
    sites.forEach(site => {
      const { nom_du_type, nom_produit, cp: code_postal, adresse_complete, coordonnees_geographiques, site_internet_et_autres_liens } = site;
      const siteInternet = site_internet_et_autres_liens ? JSON.parse(site_internet_et_autres_liens)[0] || null : null;
      const description = site.commentaire_1;
  
      // Initialiser lat et lon à null
      let lat = null;
      let lon = null;
  
      // Vérifier si coordonnees_geographiques n'est pas null avant de déstructurer
      if (coordonnees_geographiques) {
        lat = coordonnees_geographiques.lat;
        lon = coordonnees_geographiques.lon;
      }
  
      // Vérification du format des coordonnées géographiques (modifié pour gérer null)
      const isValidCoordinate = value => value != null && /^-?\d{1,3}\.\d+$/.test(value.toString());
      if (!isValidCoordinate(lat) || !isValidCoordinate(lon)) {
        console.error('Coordonnées géographiques invalides, ligne non enregistrée');
        return; // Ne pas enregistrer la ligne si les coordonnées sont invalides
      }
  
      lat = lat.toString();
      lon = lon.toString();
  
      const query = `
        INSERT INTO site (nom_du_type, nom_du_site, code_postal, commune, voie, adresse_complete, latitude, longitude, site_internet, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          code_postal = VALUES(code_postal),
          commune = VALUES(commune),
          voie = VALUES(voie),
          adresse_complete = VALUES(adresse_complete),
          latitude = VALUES(latitude),
          longitude = VALUES(longitude),
          site_internet = VALUES(site_internet),
          description = VALUES(description);
      `;
  
      connection.query(query, [nom_du_type, nom_produit, code_postal, site.commune, site.voie, adresse_complete, lat, lon, siteInternet, description], (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        console.log('Ligne insérée avec succès');
      });
    });
  };
  
  
  

connection.connect(async err => {
  if (err) {
    return console.error('erreur de connexion:', err);
  }
  console.log('Connecté à la base de données MySQL');

  try {
    await createTableIfNotExists();
    const sites = await fetchData();
    insertDataIntoDB(sites);
  } catch (error) {
    console.error(error);
  } finally {
    connection.end(); // Fermer la connexion une fois que tout est terminé
  }
});
