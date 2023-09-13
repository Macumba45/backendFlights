const express = require('express');
const http = require('http');
const WebSocketServer = require('ws');
const cors = require('cors');
const axios = require('axios');
const Binance = require('binance-api-node').default


const app = express();
const server = http.createServer(app);
const PORT = 3000;
const API_URL = "https://rest.coinapi.io/v1/trades/latest?apikey=25A2039B-3FBC-401F-8C9A-8796204BA4E0"

app.use(cors());

const client = Binance()

// Authenticated client, can make signed calls
const client2 = Binance({
    apiKey: 'WJqBfo6mkFWBdiHAuFDBFJ06lGbUWh9DWFLRpyiwimuP8SeVmB7KX0W1awWNPSPp',
    apiSecret: 'u3L1Fpr3uZnBmmGFg3axSBGuQJKRprT5GO0bQgud7u0tPO0gihUgahvNY6Jdd4Mq',
})


app.get('/monedas', async (req, res) => {
    try {
        // Realizar una llamada a la API de Binance para obtener información de todas las monedas y sus valores
        const tickerPrices = await client.prices();

        // Realizar una llamada a la API de Binance para obtener información de la variación de las monedas en las últimas 24 horas
        const priceChanges = await client.dailyStats();

        // Obtener la lista de monedas disponibles en Binance
        const availableCoins = Object.keys(tickerPrices);

        // Crear un objeto para almacenar los datos finales
        const coinData = {};

        // Limitar el número de monedas a 50
        const maxCoins = 50;
        let coinsCount = 0;

        // Recorrer las monedas disponibles
        for (const symbol of availableCoins) {
            if (coinsCount >= maxCoins) {
                break; // Salir del bucle si ya tenemos 50 monedas
            }

            const price = parseFloat(tickerPrices[symbol]);
            const change = priceChanges.find((data) => data.symbol === symbol);
            if (change) {
                const volume24h = parseFloat(change.volume);
                const marketCap = price * volume24h;

                coinData[symbol] = {
                    name: symbol, // Aquí puedes obtener el nombre de la moneda de otra fuente si es necesario
                    price: price.toFixed(4),
                    changePercent: (((price - parseFloat(change.lastPrice)) / parseFloat(change.lastPrice)) * 100).toFixed(2),
                    volume24h: volume24h.toFixed(4),
                    marketCap: marketCap.toFixed(4),
                };

                coinsCount++;
            }
        }

        res.header('Access-Control-Allow-Origin', '*'); // Set the CORS header
        res.send(coinData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



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
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
