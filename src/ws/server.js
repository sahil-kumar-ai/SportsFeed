import { send } from "process";
import { WebSocket, WebSocketServer } from "ws";
import { wsArcJet } from "../arcjet.js";

function sendJson(socket, payload) {
    if(socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
    for (const client of wss.clients) {
        if(client.readyState !== WebSocket.OPEN) continue;

        client.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer (server) {
    const wss = new WebSocketServer({server, path: '/ws', maxPayload: 1024 * 1024 })

    wss.on('connection', async (socket, req) => {

        if(wsArcJet) {
            try {
                const decision = await wsArcJet.protect(req);

                if(decision.isDenied()) {
                    const code = decision.reason.isRateLimit() ? 1013 : 1008;
                    const reason = decision.reason.isRateLimit() ? 'Rate limit exceeded' : 'Access denied';

                    socket.close(code, reason);
                    return;
                }
            } catch (e) {
                console.error('WS Connection Error');
                socket.close(1011, 'Server Security Error');
                return;
            }
        }


        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });

        sendJson(socket, { type: 'Welcocme' });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === flase) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        })
    }, 30000);

    wss.on('close', () => clearInterval(interval));

    function broadcastMatchCreated (match) {
        broadCast(wss, { type: 'match_created', data: match});
    }

    return { broadcastMatchCreated };
}