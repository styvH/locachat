async function fetchAllRecordsAndPrintCoordinates() {
    const baseUrl = 'https://www.karudata.com/api/explore/v2.1/catalog/datasets/les-lieux-remarquables-de-la-guadeloupe/records';
    let allRecords = [];
    const limit = 20; // Nombre d'enregistrements par page
    let start = 0; // Début de la pagination
    
    // Faire un premier appel pour obtenir le total_count
    let initialUrl = `${baseUrl}?limit=1`; // Limite à 1 pour minimiser la charge de données
    let totalCount = 0; // Initialiser le nombre total d'enregistrements

    try {
        const initialResponse = await fetch(initialUrl);
        if (!initialResponse.ok) {
        throw new Error(`HTTP error! status: ${initialResponse.status}`);
        }
        const initialData = await initialResponse.json();
        totalCount = initialData.total_count; // Mettre à jour le totalCount avec la valeur obtenue
    } catch (error) {
        console.error("Erreur lors de la récupération du nombre total d'enregistrements : ", error);
        return; // Sortie en cas d'erreur
    }

    
    while (start < totalCount) {
      const url = `${baseUrl}?limit=${limit}&start=${start}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allRecords = allRecords.concat(data.results); // Ajoute les résultats à la liste totale
        start += limit; // Prépare la prochaine pagination
      } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
        break; // Sortie en cas d'erreur
      }
    }
  
    // Traite chaque enregistrement pour afficher ses coordonnées géographiques
    allRecords.forEach(record => {
      const { numero, nom_produit, coordonnees_geographiques } = record;
      if (coordonnees_geographiques) {
        console.log(`Record ${numero} - ${nom_produit}: Latitude ${coordonnees_geographiques.lat}, Longitude ${coordonnees_geographiques.lon}`);
      } else {
        console.log(`Record ${numero} - ${nom_produit} n'a pas de coordonnées géographiques disponibles.`);
      }
    });
  
    return allRecords; // Retourne la liste complète des enregistrements
  }
  
  // Appel de la fonction pour récupérer tous les enregistrements et afficher les coordonnées géographiques
  fetchAllRecordsAndPrintCoordinates();
  