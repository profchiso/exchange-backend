const express = require("express");
const { createExchangeValidation } = require("../utils/validations");
const exchangeRouter = express.Router();


const {
    getAll,
    getById,
    create,
    update,
    remove,
    getLiveCoinToFiat
} = require("../controllers/exchanges");

exchangeRouter.get("/", getAll);
exchangeRouter.get("/:id", getById);
exchangeRouter.post("/", create);
exchangeRouter.post("/coin-to-fiat", getLiveCoinToFiat);
// exchangeRouter.patch("/:id", update);
// exchangeRouter.delete("/:id", remove);

module.exports = exchangeRouter;