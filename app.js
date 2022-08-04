require("dotenv").config(); //require the config files
const express = require("express");
const cors = require("cors");
const cronJob = require("node-cron");
const moment = require("moment");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ extended: false }));
app.use(cors());
const connectToDB = require("./database/dbConnection");
connectToDB()
app.use("/api/v1/exchanges", require("./routes/exchanges"));
app.use(require("./routes/undefinedRoutes"));

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});