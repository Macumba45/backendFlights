const express = require('express');
const http = require('http');
const WebSocketServer = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const API_URL = "https://rest.coinapi.io/v1/trades/latest?apikey=5D8556DC-E7F3-4BAF-9219-CF21919F80AE"

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/trades', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        res.header('Access-Control-Allow-Origin', '*'); // Set the CORS header
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// // Crear un servidor WebSocket
// const wss = new WebSocketServer.Server({ server });

// // Conectar al WebSocket de CoinAPI
// const coinApiWebSocket = new WebSocketServer('ws://ws.coinapi.io/v1/');

// // Manejar conexiones WebSocket
// wss.on('connection', (ws) => {
//     console.log('Cliente conectado');

//     // Escuchar mensajes del cliente
//     ws.on('message', (message) => {
//         console.log(`Mensaje recibido: ${message}`);
//         // Puedes hacer lo que quieras con el mensaje aquí y luego enviar una respuesta si es necesario.
//     });

//     // Manejar desconexiones
//     ws.on('close', () => {
//         console.log('Cliente desconectado');
//     });
// });

// // Escuchar mensajes del WebSocket de CoinAPI
// coinApiWebSocket.on('open', () => {
//     console.log('Conectado al WebSocket de CoinAPI');

//     // Suscribirte a un canal o enviar comandos según la documentación de CoinAPI
//     const subscribeCommand = {
//         type: 'hello',
//         apiKey: '5D8556DC-E7F3-4BAF-9219-CF21919F80AE', // Reemplaza con tu API Key de CoinAPI
//         subscribe_data_type: ['trade'],
//     };
//     console.log(subscribeCommand)

//     coinApiWebSocket.send(JSON.stringify(subscribeCommand));
// });

// coinApiWebSocket.on('message', (message) => {
//     // Aquí recibirás datos en tiempo real desde CoinAPI
//     console.log(`Datos en tiempo real recibidos: ${message}`);
// });

// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
