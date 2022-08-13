//require packages
require("dotenv").config(); //require the config files
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const cronJob = require("node-cron");
const moment = require("moment");
const app = express(); //create an express app


const server = http.createServer(app)
const wss = new WebSocket.Server({ server }); //create a websocket server

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors()); //enable CORS
const connectToDB = require("./database/dbConnection");
connectToDB() // function to connect to the database

const { getLiveExchangesCryptoToFiatAndSave } = require("./crons/getLiveExchange")
const { undefinedRouter } = require("./routes/undefinedRoutes");
const { exchangeRouter } = require("./routes/exchanges");

//define routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Fiat to crypto currency exchange!!", statusCode: 200 })
})
app.use("/api/v1/exchanges", exchangeRouter);
app.use(undefinedRouter);

cronJob.schedule(
    `*/${process.env.MINUTES} * * * *`,
    async() => {
        console.log(`run every  ${process.env.MINUTES} minutes`);
        let data = await getLiveExchangesCryptoToFiatAndSave()
        wss.on('connection', (ws) => {
            ws.send(JSON.stringify(data));
        });
    }, { scheduled: true }
);

const PORT = process.env.PORT || 5000; //define port number
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});