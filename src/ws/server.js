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

    server.on('upgrade', async (req, socket, head) => {
        if (!wsArcJet) {
            return wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        }

        try {
            const decision = await wsArcJet.protect(req);

            if (decision.isDenied()) {
                const statusCode = decision.reason.isRateLimit() ? 429 : 403;
                const message = decision.reason.isRateLimit() ? 'Rate limit exceeded' : 'Access denied';
                const body = `${statusCode} ${message}`;

                socket.write(`HTTP/1.1 ${statusCode} ${message}\r\n`);
                socket.write('Content-Type: text/plain\r\n');
                socket.write(`Content-Length: ${Buffer.byteLength(body)}\r\n`);
                socket.write('Connection: close\r\n\r\n');
                socket.write(body);
                socket.destroy();
                return;
            }

            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        } catch (e) {
            console.error('WS upgrade protection error', e);
            socket.destroy();
        }
    });

    wss.on('connection', (socket, req) => {
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });

        sendJson(socket, { type: 'Welcome' });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();
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