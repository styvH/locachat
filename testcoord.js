async function fetchRecordsWithNullCoordinates() {
    const baseUrl = 'https://www.karudata.com/api/explore/v2.1/catalog/datasets/les-lieux-remarquables-de-la-guadeloupe/records';
    let allRecords = [];
    let start = 0;
    const limit = 20;
    let totalCount = 0;
    let nullLatitudeLongitudeCount = 0;
    let nullCoordonneesGeographiquesCount = 0;
    let recordsWithNullFields = [];
  
    // Récupérer le nombre total d'enregistrements pour savoir combien de pages parcourir
    try {
      const initialResponse = await fetch(`${baseUrl}?limit=1`);
      const initialData = await initialResponse.json();
      totalCount = initialData.total_count;
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre total d'enregistrements : ", error);
      return;
    }
  
    // Parcourir toutes les pages d'enregistrements
    while (start < totalCount) {
      const url = `${baseUrl}?limit=${limit}&start=${start}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        allRecords.push(...data.results);
        start += limit;
      } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
        break;
      }
    }
  
    // Vérifier chaque enregistrement pour latitude, longitude et coordonnees_geographiques null
    allRecords.forEach(record => {
      const { nom_produit, latitude, longitude, coordonnees_geographiques } = record;
      let isNullLatLong = latitude == null || longitude == null;
      let isNullCoordGeo = coordonnees_geographiques == null;
  
      if (isNullLatLong || isNullCoordGeo) {
        recordsWithNullFields.push({ nom_produit, latitude, longitude, coordonnees_geographiques });
  
        if (isNullLatLong) nullLatitudeLongitudeCount++;
        if (isNullCoordGeo) nullCoordonneesGeographiquesCount++;
      }
    });
  
    console.log(`Nombre d'enregistrements avec latitude ou longitude null : ${nullLatitudeLongitudeCount}`);
    console.log(`Nombre d'enregistrements avec coordonnees_geographiques null : ${nullCoordonneesGeographiquesCount}`);
    console.log("Enregistrements avec champs nulls : ", recordsWithNullFields);
  }
  
  // Appel de la fonction
  fetchRecordsWithNullCoordinates();
  