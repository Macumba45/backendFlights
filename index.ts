const express = require('express');
const cors = require('cors');
import axios from 'axios';
const API_URL = "http://api.aviationstack.com/v1/flights?access_key=797372319f9cb0d9c22f18f276e23ac4"


const app = express();
app.use(cors({
    //origin: 'https:website.com'
    origin: '*'
})); app.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});


app.get('/flights', async (req: any, res: any) => {
    const response = await axios.get(API_URL)
    res.send(response.data)
});

app.listen(3005, () => {
    console.log('Example app listening on port 3005!');
});


