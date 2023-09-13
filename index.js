var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var http = require('http');
var WebSocketServer = require('ws');
var cors = require('cors');
var axios = require('axios');
var Binance = require('binance-api-node').default;
var app = express();
var server = http.createServer(app);
var PORT = 3000;
var API_URL = "https://rest.coinapi.io/v1/trades/latest?apikey=25A2039B-3FBC-401F-8C9A-8796204BA4E0";
app.use(cors());
var client = Binance();
// Authenticated client, can make signed calls
var client2 = Binance({
    apiKey: 'WJqBfo6mkFWBdiHAuFDBFJ06lGbUWh9DWFLRpyiwimuP8SeVmB7KX0W1awWNPSPp',
    apiSecret: 'u3L1Fpr3uZnBmmGFg3axSBGuQJKRprT5GO0bQgud7u0tPO0gihUgahvNY6Jdd4Mq',
});
app.get('/monedas', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var tickerPrices, priceChanges, availableCoins, coinData, maxCoins, coinsCount, _loop_1, _i, availableCoins_1, symbol, state_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client.prices()];
            case 1:
                tickerPrices = _a.sent();
                return [4 /*yield*/, client.dailyStats()];
            case 2:
                priceChanges = _a.sent();
                availableCoins = Object.keys(tickerPrices);
                coinData = {};
                maxCoins = 50;
                coinsCount = 0;
                _loop_1 = function (symbol) {
                    if (coinsCount >= maxCoins) {
                        return "break";
                    }
                    var price = parseFloat(tickerPrices[symbol]);
                    var change = priceChanges.find(function (data) { return data.symbol === symbol; });
                    if (change) {
                        var volume24h = parseFloat(change.volume);
                        var marketCap = price * volume24h;
                        coinData[symbol] = {
                            name: symbol,
                            price: price.toFixed(4),
                            changePercent: (((price - parseFloat(change.lastPrice)) / parseFloat(change.lastPrice)) * 100).toFixed(2),
                            volume24h: volume24h.toFixed(4),
                            marketCap: marketCap.toFixed(4),
                        };
                        coinsCount++;
                    }
                };
                // Recorrer las monedas disponibles
                for (_i = 0, availableCoins_1 = availableCoins; _i < availableCoins_1.length; _i++) {
                    symbol = availableCoins_1[_i];
                    state_1 = _loop_1(symbol);
                    if (state_1 === "break")
                        break;
                }
                res.header('Access-Control-Allow-Origin', '*'); // Set the CORS header
                res.send(coinData);
                console.log(coinData);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/trades', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get(API_URL)];
            case 1:
                response = _a.sent();
                res.header('Access-Control-Allow-Origin', '*'); // Set the CORS header
                res.send(response.data);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                res.status(500).send('Internal Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});
