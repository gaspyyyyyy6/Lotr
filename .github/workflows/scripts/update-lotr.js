const fetch = require('node-fetch'); // Si nécessaire, installe 'node-fetch'
const fs = require('fs'); // Si nécessaire pour gérer des fichiers locaux

async function mettreAJourFichierGitHub() {
  const url = 'https://api.github.com/repos/gaspyyyyyy6/Lotr/contents/lotr.json';
  const data = { points, territoires }; // Données à sauvegarder

  try {
    console.log("Step 1: Fetching SHA...");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GIT_TOKEN}`
      }
    });

    let sha = null;

    if (response.ok) {
      const fileData = await response.json();
      sha = fileData.sha; // SHA du fichier existant
      console.log("Step 2: SHA récupérée :", sha);
    } else if (response.status === 404) {
      console.warn("Fichier non trouvé, il sera créé.");
    } else {
      const errorText = await response.text();
      console.error("Erreur lors de la récupération du fichier:", errorText);
      return; // Si l'on ne peut pas récupérer le fichier, arrêter le processus.
    }

    console.log("Step 3: Encoding content to Base64...");
    const jsonData = JSON.stringify(data, null, 2); // Conversion en JSON
    const updatedContent = Buffer.from(jsonData).toString('base64'); // Encodage sécurisé
    console.log("Step 3: Base64 Content Encoded");

    console.log("Step 4: Sending update request...");
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GIT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Mise à jour des points et territoires',
        content: updatedContent,
        sha: sha || undefined // Si le fichier n'existe pas, GitHub n'a pas besoin du SHA
      })
    });

    if (updateResponse.ok) {
      console.log("Step 5: Update successful!");
    } else {
      const errorText = await updateResponse.text();
      console.error("Step 5: Failed to update file:", errorText);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// Lancement de la mise à jour
mettreAJourFichierGitHub();
