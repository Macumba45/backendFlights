const express = require('express');
const cors = require('cors');
import axios from 'axios';
const API_URL = "http://api.aviationstack.com/v1/flights?access_key=797372319f9cb0d9c22f18f276e23ac4&limit=20"

const app = express();

// Enable CORS for all origins
app.use((res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
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

app.listen(3005, () => {
    console.log('Example app listening on port 3005!');
});
