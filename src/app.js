import "./utils/env.js";
import { startTime, memoryUsage, getOpportunity, setPriceData } from "./utils/functions.js";
import { apiFetchConnection, apiSendOrder } from "./requests.js";
import Datafeed from "./datafeed/Datafeed.js";
import { state } from "./state.js";

let datafeedWs;

export const app = {
    init: () => {
        state.startTime = Date.now();
        datafeedWs = new Datafeed();
        datafeedWs.onMessage((data) => {
            setPriceData(data);
            const order = getOpportunity();
            if (order) {
                console.log(order);
                process.exit();
                //apiSendOrder(order);
            }
        });
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

    // reset: () => {
    //     exchange1Ws.reset();
    //     exchange2Ws.reset();
    //     return state.resetTime = 0;
    // },

    printConsole: () => {
        console.clear();
        //if (state.resetTime > 3600) app.reset(); // 1 heure
        app.printBanner();
        console.log('priceData:', state.priceData);
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

