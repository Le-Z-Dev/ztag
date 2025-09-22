require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();

// Sert le dossier 'docs' pour accéder à index.html, form.html, etc.
app.use(express.static(path.join(__dirname, 'docs')));

// Support JSON avec limite pour les images Base64
app.use(express.json({ limit: '5mb' }));

// Endpoint pour recevoir le JSON et l'envoyer sur GitHub
app.post('/upload-json', async (req, res) => {
    const { userData } = req.body;

    if (!userData || !userData.name) {
        return res.status(400).json({ success: false, error: 'Données utilisateur invalides.' });
    }

    const repoOwner = "Le-Z-Dev";
    const repoName = "ztag-clients";
    const filePath = `clients/${userData.name.replace(/\s+/g, '_')}.json`;
    const token = process.env.GITHUB_TOKEN;

    const content = Buffer.from(JSON.stringify(userData, null, 2)).toString('base64');
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Ajout de ${userData.name}`,
                content
            })
        });

        if (response.ok) {
            return res.json({ success: true });
        } else {
            const err = await response.json();
            return res.status(400).json({ success: false, error: err.message });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Pour accéder directement à form.html via URL
app.get('/form.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'form.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));