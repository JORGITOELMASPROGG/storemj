const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 3000;

const clientId = '1335473759632490646'; // Tu Client ID
const clientSecret = 'n-ryPvA1cxess8glZvPv0uuV0suqPN0S'; // Tu Client Secret
const redirectUri = 'https://jorgitoelmasprogg.github.io/storemj/'; // La URL de redirección

// Endpoint para manejar la redirección de Discord después de la autorización
app.get('/callback', async (req, res) => {
    const { code } = req.query;

    // Intercambiar el código de autorización por un token de acceso
    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const data = querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        scope: 'identify email',
    });

    try {
        const tokenResponse = await axios.post(tokenUrl, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = tokenResponse.data;

        // Obtener la información del usuario desde la API de Discord
        const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = userResponse.data;

        // Redirigir al cliente con la información del usuario (puedes renderizar un HTML con su avatar)
        res.redirect(`https://jorgitoelmasprogg.github.io/storemj/?avatar=${user.avatar}&username=${user.username}`);
    } catch (error) {
        console.error(error);
        res.send('Error al obtener el token de acceso');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
