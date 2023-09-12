const express = require('express');
const cors = require('cors');
import axios from 'axios';
const API_URL = "http://api.aviationstack.com/v1/flights?access_key=797372319f9cb0d9c22f18f276e23ac4&limit=50"

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto al dominio correcto de tu aplicación
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
// Enable CORS for all origins
app.use(cors(corsOptions));

app.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

app.get('/flights', async (req: any, res: any) => {
    try {
        const response = await axios.get(API_URL);
        res.header('Access-Control-Allow-Origin', '*'); // Set the CORS header
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
