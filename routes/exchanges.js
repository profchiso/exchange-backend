const express = require("express");
const { createExchangeValidation } = require("../utils/validations");
const exchangeRouter = express.Router();


const {
    getAll,
    getById,
    create,
    update,
    remove
} = require("../../controllers/exchanges");

exchangeRouter.get("/", getAll);
exchangeRouter.get("/:id", getById);
exchangeRouter.post("/", createExchangeValidation, create);
exchangeRouter.patch("/:id", update);
exchangeRouter.delete("/:id", remove);

module.exports = exchangeRouter;