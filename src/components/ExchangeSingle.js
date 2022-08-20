import React, {useState, useEffect} from 'react';
import moment from 'moment';
import axiosInstance from './../index';

const MARKET_STACK_QUOTE_URL = `${process.env.REACT_APP_KB_API_BASE_URL}/api/back/rate`;


function ExchangeSingle(props) {

    const [stock, setStock] = useState({
        buyRate: 0,
        cashBuyRate: 0,
        cashSellRate: 0,
        currency: "",
        flag: "",
        midRate:0,
        name: "",
        number: 0,
        sellRate: 0,
        shortName: ""
    });

    useEffect(() => {
        axiosInstance.get(MARKET_STACK_QUOTE_URL, {
            params: {
                symbols: props.symbol,
                interval: '15min',
                date_from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
                date_to: moment().format('YYYY-MM-DD'),
                limit: '1',
            }
        }).then((result) => {
            console.log(result)
            if (!result.data) {
                console.log("ff")
                return;
            }
            else {
                setStock({
                    buyRate: result.data.buyRate,
                    cashBuyRate: result.data.cashBuyRate,
                    cashSellRate: result.data.cashSellRate,
                    currency: result.data.currency,
                    flag: result.data.flag,
                    midRate: result.data.midRate,
                    name: result.data.name,
                    number: result.data.number,
                    sellRate: result.data.sellRate,
                    shortName: result.data.shortName
                });
                console.log(stock)
            }
        });
    },[]);

   // const varColor =1 < 0 ? 'text-red-500' : 'text-green-500';

    function currencyFormat(num) {
        return parseFloat(num)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className="body-exchangeRate-item">
            <div className="body-exchangeRate-item-left">
                <img src="https://khanbank.bits.mn/assets/images/1x1.png"
                     className="body-exchangeRate-item-left-image"
                     style={{
                         backgroundImage: stock.flag
                             ? 'url(' + 'https://khanbank.bits.mn' + stock.flag + ')'
                             : `url(https://khanbank.bits.mn/assets/images/flags/us.png)`
                     }}/>
                <p className="body-exchangeRate-item-left-name">{stock.currency}</p></div>
            <div className="body-exchangeRate-item-right">
                <div><p className="body-exchangeRate-item-right-title">авах</p><p
                    className="body-exchangeRate-item-right-title">зарах</p></div>
                <div><p>{currencyFormat(stock.sellRate)}</p><p>{currencyFormat(stock.buyRate)}</p></div>
            </div>
        </div>
    );
}

export default ExchangeSingle;
