import "./utils/env.js";

export const state = {
    interval: null,
    startTime: 0,
    //resetTime: 0,
    apiToken: null,
    apiBusy: false,
    threshold: process.env.APP_THRESHOLD,
    priceData: {},
    buySellDiff1To2: {},
    buySellDiff2To1: {},
    buySellOp1To2: {
        'count' : 0,
        'order': {},
        'history': [],
    },
    buySellOp2To1: {
        'count' : 0,
        'order': {},
        'history': [],
    },
    sellBuyDiff1To2: {},
    sellBuyDiff2To1: {},
    sellBuyOp1To2: {
        'count' : 0,
        'order': {},
        'history': [],
    },
    sellBuyOp2To1: {
        'count' : 0,
        'order': {},
        'history': [],
    }
};