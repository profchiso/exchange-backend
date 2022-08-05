//require packages
require("dotenv").config(); //require the config files
const express = require("express");
const cors = require("cors");
const path = require("path");
// const cronJob = require("node-cron");
const moment = require("moment");
const app = express(); //create an express app
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors()); //enable CORS
const connectToDB = require("./database/dbConnection");
connectToDB() // function to connect to the database
const { getLiveExchange } = require("./crons/getLiveExchange")
getLiveExchange("BTC") // function
const { undefinedRouter } = require("./routes/undefinedRoutes");

//define routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Fiat to crypto currency exchange!!", statusCode: 200 })
})
app.use("/api/v1/exchanges", require("./routes/exchanges"));
app.use(undefinedRouter);

const PORT = process.env.PORT || 5000; //define port number
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});