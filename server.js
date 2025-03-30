// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
// Chemin complet vers le fichier de stockage
const dataFilePath = path.join(__dirname, 'lotr.json');

// Middleware pour parser le JSON
app.use(bodyParser.json());
// Pour servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(__dirname));

// Endpoint pour charger les données
app.get('/lotr', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      // Si le fichier n'existe pas, renvoyer des données initiales vides
      if (err.code === 'ENOENT') {
        return res.json({ points: [], territoires: [] });
      }
      console.error("Erreur lors de la lecture du fichier", err);
      return res.status(500).send("Erreur lors du chargement des données");
    }
    try {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    } catch (parseError) {
      console.error("Erreur de parsing", parseError);
      res.status(500).send("Erreur de parsing des données");
    }
  });
});

// Endpoint pour sauvegarder les données
app.put('/lotr', (req, res) => {
  const newData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), (err) => {
    if (err) {
      console.error("Erreur lors de la sauvegarde", err);
      return res.status(500).send("Erreur lors de la sauvegarde");
    }
    res.send("Données sauvegardées avec succès");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
