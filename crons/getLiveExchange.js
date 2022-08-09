const axios = require('axios')
const { Currency, Coins } = require('../utils/currency')
const Exchange = require("../database/model/Exchanges")



exports.sendLiveExchange = async(req, res) => {}

exports.getLiveExchange = async(coin) => {
    try {

        let { data } = await axios.get(`${process.env.COINAPI_URL}/${coin}?invert=false`, {
            headers: {
                "X-CoinAPI-Key": process.env.COINAPI_KEY
            }
        })

        let interested = data.rates.filter(item => Currency.includes(item.asset_id_quote))
        console.log(interested)



    } catch (error) {
        console.log(error);

    }


}

exports.getLiveExchangesCryptoToFiat = async(coin, fiat) => {
    let { data } = await axios.get(`${process.env.COINAPI_URL}/${coin}/${fiat}?invert=false`, {
        headers: {
            "X-CoinAPI-Key": process.env.COINAPI_KEY
        }
    })
    return data


}
exports.getLiveExchangesCryptoToFiatAndSave = async() => {
    try {

        for (let i = 0; i < Currency.length; i++) {
            for (let j = 0; j < Coins.length; j++) {
                let x = await this.getLiveExchangesCryptoToFiat(Coins[j].symbol, Currency[i])
                let exchangeObj = {
                    currencyFrom: Coins[j].name,
                    currencyTo: Currency[i],
                    amount1: 1,
                    amount2: x.rate,
                    type: "Live Price",
                }

                let createdExchange = await Exchange.create(exchangeObj)
                console.log(createdExchange)

            }

        }

    } catch (error) {
        console.log(error);


    }
}