// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();

app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.json({ limit: '5mb' })); // pour Base64 des images

// Endpoint pour recevoir le JSON et l'envoyer sur GitHub
app.post('/upload-json', async (req, res) => {
    const { userData } = req.body;

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

        if (response.ok) res.json({ success: true });
        else {
            const err = await response.json();
            res.status(400).json({ success: false, error: err.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));