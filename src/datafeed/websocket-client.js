import ReconnectingWebSocket from "reconnecting-websocket";
import WS from "ws";

const openWebSocket = (url) => (
    new Promise((resolve, reject) => {
        const connection = new ReconnectingWebSocket(url, undefined, {
            WebSocket: WS,
            connectionTimeout: 4000,
            debug: false,
            maxReconnectionDelay: 10000,
            maxRetries: Infinity,
            minReconnectionDelay: 4000
        })

        connection.onopen = () => resolve(connection);
        connection.onerror = (err) => reject(err);
    })
)

export const handleData = async (endpoint, callback, state) => {
    const w = await openWebSocket(endpoint);
    w.onmessage = (msg) => {
        state('Connected');
        let msg_data = JSON.parse(msg.data);
        callback(msg_data);
    }
    return () => {
        w.close(1000, "Close handle was called", { keepClosed: true });
        state('Disconnected');
    }
}