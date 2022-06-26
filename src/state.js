import "./utils/env.js";

export const state = {
    interval: null,
    startTime: 0,
    //resetTime: 0,
    apiToken: null,
    apiBusy: false,
    threshold: process.env.APP_THRESHOLD,
    priceData: {},
    buyData: {},
    sellData: {},
    buyTrade: null,
    sellTrade: null,
};