const { body } = require("express-validator")


const createExchangeValidation = [
    body('currencyFrom')
    .trim()
    .notEmpty()
    .withMessage('currencyFrom is required')
    .isString()
    .withMessage('currencyFrom must be a string'),

    body('currencyTo')
    .trim()
    .notEmpty()
    .withMessage('currencyTo is required')
    .isString()
    .withMessage('currencyFrom must be a string'),

    body('amount1')
    .trim()
    .notEmpty()
    .withMessage('amount1 is required')
    .isNumeric()
    .withMessage('amountTo must be a number'),

    body('amount2')
    .trim()
    .notEmpty()
    .withMessage('amount2 is required')
    .isNumeric()
    .withMessage('amountTo must be a number'),

    body('type')
    .trim()
    .notEmpty()
    .withMessage('type is required')
    .isString()
    .withMessage('currencyFrom must be a string'), ,

]
module.exports = { createExchangeValidation }