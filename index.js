const debug = require('debug')('message-server:server');
const http = require('http');
const express = require("express");
const WebSocket = require("ws");

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
const wss = new WebSocket.Server({server});

wss.on("connection", (socket, request) => {
    debug("A new connection established. yayyy!!!");
    socket.on("message", (data) => {
        const message = JSON.parse(data);
        debug("New Message Received: ", message);
        socket.send("Message Received");
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
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', (err) => {
    debug("Error in http Server: ", err);
});
server.on('listening', () => {
    debug(`http server listening on Port: ${port}`);
});