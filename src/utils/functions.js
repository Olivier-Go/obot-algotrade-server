import { state } from "./../state.js";

export const isEmptyObj = (obj) => (
    Object.keys(obj).length === 0
);

export const timeAgo = (timestamp) => (
    (Date.now() - timestamp) / 1000
);

export const twoDigit = (number) => (
    number.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: false })
);

export const startTime = () => {
    const today = new Date();
    const date = `${twoDigit(today.getDate())}/${twoDigit(today.getMonth()+1)}/${today.getFullYear()}`;
    const time = `${twoDigit(today.getHours())}:${twoDigit(today.getMinutes())}:${twoDigit(today.getSeconds())}`;
    let since = new Date(timeAgo(state.startTime) * 1000).toISOString();
    const days = new Date(timeAgo(state.startTime) * 1000).toISOString().substring(8, 10);
    const hours = new Date(timeAgo(state.startTime) * 1000).toISOString().substring(11, 19);
    since = `${Number(days) - 1}D-${hours}`
    return {
        date,
        time,
        since
    }
};

export const memoryUsage = () => (
    Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100
);

export const setPriceData = (data) => {
    state.priceData = {
        buyData: {
            price: data.orderbook.ask.price,
            size: data.orderbook.ask.size,
            timestamp: data.orderbook.timestamp
        },
        sellData: {
            price: data.orderbook.bid.price,
            size: data.orderbook.bid.size,
            timestamp: data.orderbook.timestamp
        },
        SMA: data.SMA,
        shortMA: data.shortMA,
        longMA: data.longMA
    };
}

const formatOrder = (side) => {
    let priceData = null;
    switch (side) {
        case 'buy':
            priceData = state.priceData.buyData;
            break
        case 'sell':
            priceData = state.priceData.sellData;
            break
        default:
            return priceData;
    }
    const { price, size, timestamp } = priceData;
    return {
        ticker: process.env.TICKER,
        market: process.env.EXCHANGE,
        type: 'market',
        side,
        price,
        size,
        timestamp,
        SMA: state.priceData.SMA,
        shortMA: state.priceData.shortMA,
        longMA: state.priceData.longMA
    }
}


export const getOpportunity = () => {
    if (!state.buyTrade && !state.sellTrade) {
        if (state.priceData.buyData.price <= state.priceData.longMA && state.priceData.buyData.size >= process.env.ORDER_SIZE) {
            return formatOrder('buy');
        }
    }
    else if (state.buyTrade && state.priceData.buyData.price >= state.priceData.SMA) {
        return formatOrder('sell');
    }

    if (!state.buyTrade && !state.sellTrade) {
        if (state.priceData.sellData.price >= state.priceData.shortMA && state.priceData.sellData.size >= process.env.ORDER_SIZE) {
            return formatOrder('sell');
        }
    }
    else if (state.sellTrade && state.priceData.sellData.price <= state.priceData.SMA) {
        return formatOrder('buy');
    }

    return null;
};