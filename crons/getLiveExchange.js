const axios = require('axios')
const { Currency } = require('../utils/currency')

exports.sendLiveExchange = async(req, res) => {}

exports.getLiveExchange = async(coin) => {
    try {

        let res = await axios.get(`${process.env.COINAPI_URL}/${coin}/?invert=false`, {
            headers: {
                "X-CoinAPI-Key": process.env.COINAPI_KEY
            }
        })
        console.log(res)

    } catch (error) {
        console.log.log(error);

    }


}