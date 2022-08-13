const moment = require('moment');
const Exchange = require("../database/model/Exchanges");
const { Currency, Coins } = require("../utils/currency");
const { getLiveExchangesCryptoToFiat } = require("../crons/getLiveExchange");
exports.getAll = async(req, res) => {

    try {
        let requestQueryObject = {...req.query }
        if (req.query.type && req.query.type.toLowerCase() === "all") {
            delete requestQueryObject.type
        }

        let excludedQueryFields = ['sort', 'page', 'pageSize', 'fields', "fromDate", "toDate"]; //fields to exclude from the query
        excludedQueryFields.forEach(
            (element) => delete requestQueryObject[element]
        ); //delete any key in the requestQueryObject containing an element in the  excludedQueryFields  array

        //advance query using gte,lte,gt,lt
        let queryToString = JSON.stringify(requestQueryObject);
        queryToString = queryToString.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (match) => `$${match}`
        );

        let parsedQuery = JSON.parse(queryToString);

        if (req.query.fromDate && req.query.toDate) {
            console.log(req.query.fromDate, req.query.toDate)
            let fDate = req.query.fromDate.split("/")
            let tDate = req.query.toDate.split("/")

            parsedQuery.createdAt = { $gte: new Date(`${Number(fDate[1])}/${Number(fDate[0])+1}/${fDate[2]}`), $lte: new Date(`${Number(tDate[1])}/${Number(tDate[0])+1}/${tDate[2]}`) }

        }

        let query = Exchange.find(parsedQuery); // the .select excludes any spacified field before sending the document

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
        const pageSize = req.query.pageSize * 1 || 50;
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
        let cf = Coins.filter(coin => coin.symbol === currencyFrom)[0].name

        const exchange = await Exchange.create({ currencyFrom: cf, currencyTo, amount1, amount2, type })
        res.status(201).json({ message: "Exchange created  successfully", statusCode: 201, data: exchange })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }

}

exports.getLiveCoinToFiat = async(req, res) => {
    try {
        const { coin, fiat, amount1 } = req.body;
        if (!coin || !fiat || !amount1) {
            return res.status(400).json({ message: "invalid params, coin and fiat must be provided", statusCode: 400 });
        }
        const result = await getLiveExchangesCryptoToFiat(coin, fiat);
        let exchangeObj = {
            currencyFrom: coin,
            currencyTo: fiat,
            amount1,
            amount2: result.rate * amount1,
            type: "Exchanged",
        }
        return res.status(200).json({ message: "Remote exchange fetched successfully", statusCode: 200, data: exchangeObj });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || "something went wrong", statusCode: 500 })

    }


}