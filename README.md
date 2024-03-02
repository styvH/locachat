# Locasite

M2 MIAGE : Projet WEBSERVICE Application liant Géolocalisation et Communication API REST

Réalisé par 
BARVAUT Teddrice
HAUTERVILLE Styvan
OZIER-LAFONTAINE Josuah

L'application fonctionne avec React et Node.js

# Instructions de démarrage du projet


### `git clone https://github.com/styvH/locasite`

### `cd locasite`

### `cp .env.example .env`

### `npm install` / `npm update`

#### Initialisation des données 

Après avoir configuré votre fichier .env avec les informations de votre base de donnée phpmyadmin, vous pourrez lancer les commandes suivantes : 

### `node initDatabase.js`

### `node insertSite1.js`

### `node insertSite2.js`

Ces commandes initialiseront votre base de données sélectionné et alimenteront la table des sites à partir des API suivantes :

https://www.karudata.com/explore/dataset/liste-des-jardins-remarquables/api/

https://www.karudata.com/explore/dataset/les-lieux-remarquables-de-la-guadeloupe/api/

## Scripts de lancement du projet


### Lancement du serveur : `node src/server.js`

### Lancement du projet : `npm start`

Ouvrez la page [http://localhost:3000](http://localhost:3000) pour voir le rendu dans votre navigateur.
