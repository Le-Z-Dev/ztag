const express = require('express');
const path = require('path');
const app = express();

// Sert le dossier admin
app.use(express.static(path.join(__dirname, 'admin')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
