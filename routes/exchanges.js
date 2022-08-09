const express = require("express");
const { createExchangeValidation, ExchangeBodyValidation } = require("../utils/validations");
const exchangeRouter = express.Router();


const {
    getAll,
    getById,
    create,
    getLiveCoinToFiat
} = require("../controllers/exchanges");

exchangeRouter.get("/", getAll);
exchangeRouter.get("/:id", getById);
exchangeRouter.post("/", createExchangeValidation, create);
exchangeRouter.post("/coin-to-fiat", ExchangeBodyValidation, getLiveCoinToFiat);

module.exports = exchangeRouter;