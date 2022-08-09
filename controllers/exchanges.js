const Exchange = require("../database/model/Exchanges");
const { Currency, Coins } = require("../utils/currency");
const { getLiveExchangesCryptoToFiat } = require("../crons/getLiveExchange");
exports.getAll = async(req, res) => {

    try {
        let requestQueryObject = {...req.query }
        let excludedQueryFields = ['sort', 'page', 'pageSize', 'fields']; //fields to exclude from the query
        excludedQueryFields.forEach(
            (element) => delete requestQueryObject[element]
        ); //delete any key in the requestQueryObject containing an element in the  excludedQueryFields  array

        //advance query using gte,lte,gt,lt
        let queryToString = JSON.stringify(requestQueryObject);
        queryToString = queryToString.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (match) => `$${match}`
        );
        let query = Exchange.find(JSON.parse(queryToString)); // the .select excludes any spacified field before sending the document

        //sorting query result
        if (req.query.sort) {
            // to sort pass the sort param ie ?sort="field1,field2,..." //ascending
            // to sort pass the sort param ie ?sort="-field1,-field2,..." //descending
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //field limiting
        //pass a parameter called field eg. ?fields=field1,field2,...
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v ');
        }

        //pagination
        //pass page and pageSize params  eg  ?page=1&pageSize=20
        const page = req.query.page * 1 || 1;
        const pageSize = req.query.pageSize * 1 || 10;
        const skip = (page - 1) * pageSize;
        query = query.skip(skip).limit(pageSize);

        //handle a case where user specify page that does not exists
        if (req.query.page) {
            let numberOfDocument = await Exchange.countDocuments();
            if (skip >= numberOfDocument) {
                return res.status(404).json({ message: 'Page not found', statusCode: 404 });
            }
        }

        //execute query
        const result = await query; // query.sort().select().skip().limit()

        res.status(200).json({ message: "Exchange data fetched  successfully", statusCode: 200, data: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }

}
exports.getById = async(req, res) => {
    try {

        const exchange = await Exchange.findById(req.params.id).select(
            '-__v'
        );
        if (!exchange) {
            return res.status(404).json({ message: "No record found with the id ${req.params.id}", statusCode: 400 });
        }
        res.status(200).json({ message: "Exchange data fetched  successfully", statusCode: 200, data: exchange })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }

}
exports.create = async(req, res) => {
    try {
        const { currencyFrom, currencyTo, amount1, amount2, type } = req.body
        const exchange = await Exchange.create({ currencyFrom, currencyTo, amount1, amount2, type })
        res.status(201).json({ message: "Exchange created  successfully", statusCode: 201, data: exchange })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }

}
exports.update = async(req, res) => {
    try {

    } catch (error) {
        console.log(error);

    }

}
exports.remove = async(req, res) => {
    try {

    } catch (error) {
        console.log(error);

    }

}
exports.getLiveCoinToFiat = async(req, res) => {
    try {
        const { coin, fiat, amount1 } = body;
        if (!coin || !fiat || !amount1) {
            return res.status(400).json({ message: "invalid params, coin and fiat must be provided", statusCode: 400 });
        }
        const result = await getLiveExchangesCryptoToFiat(coin, fiat);
        let exchangeObj = {
            currencyFrom: Coins.filter(coin => coin.symbol === coin)[0].name,
            currencyTo: fiat,
            amount1,
            amount2: result.rate * amount1,
            type: "Exchanged",
        }
        return res.status(200).json({ message: "Remote exchange fetched successfully", statusCode: 200, data: exchangeObj });
    } catch (error) {
        console.log
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }


}