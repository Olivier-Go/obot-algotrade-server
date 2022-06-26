import './../utils/env.js';
import { handleData } from './websocket-client.js';

export default class {
    state = 'Disconnected';

    async onMessage(callback) {
        return await handleData(
            process.env.DATAFEED_ENDPOINT,
            callback,
            (e) => this.state = e
        );
    }
}