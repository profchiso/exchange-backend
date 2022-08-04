const express = require("express");
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
exchangeRouter.post("/", create);
exchangeRouter.patch("/:id", update);
exchangeRouter.delete("/:id", remove);

module.exports = exchangeRouter;