const debug = require('debug')('message-server:server');
const http = require('http');
const express = require("express");
const WebSocket = require("ws");
const { validateMessage, createAcknowledgement, createErrorMessage, cleanupConnections } = require("./utils");
/**
 * Get port from environment and store in the app.
 */
const port = +(process.env.PORT || '3000');

/**
 * Create express app and http server
 */
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => res.json({ "hello": "hi" }));


/**
 * Create a Websocket Server for realtime messaging
 */
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket, request) => {
    debug("A new connection established. yayyy!!!");
    socket.on("message", (data) => {
        try {
            const message = JSON.parse(data);
            debug("New Message Received: ", message);
            validateMessage(message);
            socket.send(JSON.stringify(createAcknowledgement(message)));
            wss.clients.forEach((client) => {
                client.send(data);
            }); // broadcast to all connected users
        } catch (err) {
            debug("An Error has occurred on message: ", err);
            socket.send(JSON.stringify(createErrorMessage(data, err)));
        }
    });
    socket.on("error", (err) => {
        debug("An error has occured in the socket: ", err);
    });
    socket.on("close", (code, reason) => {
        debug(`Socket is closed: `, code, reason);
    });
});
wss.on("error", (err) => {
    debug("An error has occurred in WS Server: ", err);
});
wss.on("headers", (headers, request) => {
    debug("Response Headers for new connection: ", headers.toString());
});
wss.on("listening", () => {
    debug("WS Server is listening...");
});
wss.on("close", () => {
    debug("WS Server is closed");
});


/**
 * Place a proper check and balance on each
 * connection and destroy the broken connections\
 */
cleanupConnections(wss);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', (err) => {
    debug("Error in http Server: ", err);
});
server.on('listening', () => {
    debug(`http server listening on Port: ${port}`);
});