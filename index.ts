const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http'); // Necesitamos el módulo http de Node.js
const webSock = require('ws'); // Importa la librería ws

const API_URL = "http://api.aviationstack.com/v1/flights?access_key=797372319f9cb0d9c22f18f276e23ac4&limit=50"

const app = express();
app.use(cors());

// Crea un servidor HTTP utilizando Express
const server = http.createServer(app);

// Crea un servidor WebSocket vinculado al servidor HTTP
const wss = new webSock.Server({ server });

wss.on('connection', (ws) => {
    console.log('Cliente conectado al WebSocket');

    // Maneja mensajes entrantes desde el cliente WebSocket
    ws.on('message', (message) => {
        console.log(`Mensaje recibido desde el cliente: ${message}`);
    });

    // Envía un mensaje de bienvenida al cliente
    ws.send('¡Bienvenido al servidor WebSocket!');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/flights', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        res.header('Access-Control-Allow-Origin', '*');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

server.listen(3005, () => {
    console.log('Servidor Express y WebSocket escuchando en el puerto 3005');
});
