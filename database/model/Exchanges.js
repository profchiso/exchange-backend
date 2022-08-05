const { Schema, model } = require("mongoose");
const ExchangeSchema = new Schema({
    currencyFrom: {
        type: String,
        required: true,

    },
    currencyTo: {
        type: String,
        required: true,
    },
    amount1: {
        type: Number,
        required: true,

    },
    amount2: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["Live Price", "Exchanged"],
        index: true,

    },
    createdAt: {
        type: Date,
        default: Date.now(),
        index: true,
    },
});

const Exchange = model("Exchange", ExchangeSchema);
module.exports = Exchange;