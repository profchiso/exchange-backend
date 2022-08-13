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
    .withMessage('currencyTo must be a string'),

    body('amount1')
    .trim()
    .notEmpty()
    .withMessage('amount1 is required')
    .isNumeric()
    .withMessage('amount1 must be a number'),

    body('amount2')
    .trim()
    .notEmpty()
    .withMessage('amount2 is required')
    .isNumeric()
    .withMessage('amount2 must be a number'),

    body('type')
    .trim()
    .notEmpty()
    .withMessage('type is required')
    .isString()
    .withMessage('currencyFrom must be a string'),

]

const ExchangeBodyValidation = [
    body('coin')
    .trim()
    .notEmpty()
    .withMessage('coin abbreviation is required')
    .isString()
    .withMessage('coin abbreviation must be a string'),
    body('fiat')
    .trim()
    .notEmpty()
    .withMessage('fiat currency abbreviation is required')
    .isString()
    .withMessage('fiat currency abbreviation must be a string'),
    body('amount1')
    .trim()
    .notEmpty()
    .withMessage('fiat currency abbreviation is required')
    .isNumeric()
    .withMessage('amount1 must be a number')
]
module.exports = { createExchangeValidation, ExchangeBodyValidation }