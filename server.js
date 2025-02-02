const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Variables de entorno
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Ruta principal que maneja la autenticación
app.get('/auth/discord', (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    // Intercambiar el 'code' por un 'access_token'
    axios.post('https://discord.com/api/oauth2/token', null, {
        params: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            scope: 'identify email',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => {
        const { access_token } = response.data;

        // Usar el 'access_token' para obtener los datos del usuario
        return axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
    })
    .then(response => {
        const user = response.data;

        // Enviar los datos del usuario (username, avatar, etc.)
        res.json({
            username: user.username,
            avatar: user.avatar,
            id: user.id,
        });
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error durante la autenticación');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
