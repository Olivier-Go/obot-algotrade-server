import "./utils/env.js";
import {drawOrdersArr, isEmptyObj, startTime, memoryUsage} from "./utils/functions.js";
import {updateBuySellDiff, updateSellBuyDiff, updateBuySellOp, updateSellBuyOp} from "./opportunities.js";
import {apiFetchConnection, apiAddOpportunity} from "./requests.js";
import Datafeed from "./datafeed/Datafeed.js";
import { state } from "./state.js";

let datafeedWs;

export const app = {
    init: () => {
        state.startTime = Date.now();
        datafeedWs = new Datafeed();
        datafeedWs.onMessage((data) => state.priceData = data);
        // setInterval(() => {
        //     state.resetTime += 1;
        // }, 1000);
    },

    printBanner: () => {
        console.log(`----------------------------------------------------------------------------`);
        const startedTime = startTime();
        console.log(` ${startedTime.date} ${startedTime.time} - Started : ${startedTime.since} - Mem : ${memoryUsage()} MB `);
        console.log(` Threshold : ${state.threshold}  |  Datafeed : ${datafeedWs.state}`);
        console.log(`----------------------------------------------------------------------------`);
    },

    printBuySellDiff: () => {
        console.log(`          DIFF  :   BUY ${process.env.EXCHANGE1} / SELL ${process.env.EXCHANGE2}                   `);
        state.buySellDiff1To2 = updateBuySellDiff(exchange2Ws.sellOrders, exchange1Ws.buyOrders, state.orderSize);
        console.table(drawOrdersArr(state.buySellDiff1To2.diff));
        console.log(`          DIFF  :   BUY ${process.env.EXCHANGE2} / SELL ${process.env.EXCHANGE1}                   `);
        state.buySellDiff2To1 = updateBuySellDiff(exchange1Ws.sellOrders, exchange2Ws.buyOrders, state.orderSize);
        console.table(drawOrdersArr(state.buySellDiff2To1.diff));
    },

    printSellBuyDiff: () => {
        console.log(`          DIFF  :   SELL ${process.env.EXCHANGE1} / BUY ${process.env.EXCHANGE2}                    `);
        state.sellBuyDiff1To2 = updateSellBuyDiff(exchange2Ws.buyOrders, exchange1Ws.sellOrders, state.orderSize);
        console.table(drawOrdersArr(state.sellBuyDiff1To2.diff));
        console.log(`          DIFF  :   SELL ${process.env.EXCHANGE2}  / BUY ${process.env.EXCHANGE1}                   `);
        state.sellBuyDiff2To1 = updateSellBuyDiff(exchange1Ws.buyOrders, exchange2Ws.sellOrders, state.orderSize);
        console.table(drawOrdersArr(state.sellBuyDiff2To1.diff));
    },

    // reset: () => {
    //     exchange1Ws.reset();
    //     exchange2Ws.reset();
    //     return state.resetTime = 0;
    // },

    printConsole: () => {
        console.clear();
        //if (state.resetTime > 3600) app.reset(); // 1 heure
        app.printBanner();
        console.log(state.priceData);
        //exchange1Ws.printOrderBook();
        //exchange2Ws.printOrderBook();
        // app.printBuySellDiff();
        // app.buySellOp(true, state.ticker);
        // app.printSellBuyDiff();
        // app.sellBuyOp(true, state.ticker);
    },

    start: async (apiState) => {
        switch (apiState) {
            case "enable":
                await apiFetchConnection();
                app.run();
                break;
            case "disable":
                app.run();
                break;
            default:
                console.warn(`Variable API_STATE non definie !`);
                process.exit(1);
        }
    },

    run: () => {
        app.init();
        state.interval = setInterval(app.printConsole, state.threshold);
    },

    stop: () => {
        clearInterval(state.interval);
    }
};

app.start(process.env.API_STATE);

