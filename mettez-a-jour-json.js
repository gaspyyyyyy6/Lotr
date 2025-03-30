const fetch = require('node-fetch'); // On utilise 'node-fetch' pour faire des requêtes HTTP
const fs = require('fs'); // Pour gérer les fichiers locaux (facultatif dans ce cas, mais utile pour d'autres usages)
const path = require('path'); // Utilisé pour manipuler les chemins de fichiers (encore une fois, facultatif)

const url = 'https://api.github.com/repos/ton-utilisateur/ton-depot/contents/lotr.json'; // Remplace par l'URL de ton fichier JSON sur GitHub

const headers = {
  'Authorization': `Bearer ${process.env.GIT_TOKEN}`, // On utilise le token secret que tu as configuré dans GitHub Actions
  'Content-Type': 'application/json'
};

async function updateFile() {
  try {
    // 1. Récupérer les données actuelles du fichier 'lotr.json'
    const response = await fetch(url, { headers });
    const data = await response.json();
    const sha = data.sha; // Récupère le SHA du fichier actuel pour pouvoir le mettre à jour

    // 2. Modifie le contenu du fichier JSON ici (par exemple, tu peux ajouter des points ou des territoires)
    const updatedContent = JSON.stringify({
      points: [], // Ajoute ici tes points (ils seront vides dans cet exemple)
      territoires: [] // Idem pour les territoires
    }, null, 2); // Le '2' indique qu'on veut une indentation de 2 espaces dans le JSON

    // 3. Encode le contenu mis à jour en Base64 (GitHub exige que le contenu soit encodé ainsi)
    const base64Content = Buffer.from(updatedContent).toString('base64'); // Conversion en Base64

    // 4. Envoie une requête pour mettre à jour le fichier sur GitHub
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GIT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Mise à jour du fichier JSON', // Le message du commit
        content: base64Content, // Le contenu encodé en Base64
        sha: sha // Le SHA du fichier actuel, nécessaire pour effectuer une mise à jour
      })
    });

    if (updateResponse.ok) {
      console.log("Fichier mis à jour avec succès !");
    } else {
      const errorText = await updateResponse.text();
      console.error("Erreur lors de la mise à jour du fichier :", errorText);
    }
  } catch (error) {
    console.error("Une erreur est survenue :", error); // Si une erreur survient
  }
}

// Exécuter la fonction qui met à jour le fichier
updateFile();
