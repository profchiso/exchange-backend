const express = require("express");
const exchangeRouter = express.Router();


// const {
//     createAccountGroup,
//     createAccountLedger,
//     postEntry,
//     createCityLedger,
// } = require("../../controllers/account");

router.get("/", createAccountGroup);
router.get("/:id", createAccountLedger);
router.post("/", createCityLedger);
router.patch("/:id", postEntry);
router.delete("/:id", postEntry);

module.exports = exchangeRouter;