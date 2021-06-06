const debug = require('debug')('message-server:server');
const http = require('http');
const express = require("express");

/**
 * Get port from environment and store in the app.
 */
const port = +(process.env.PORT || '3000');

/**
 * Create express app and http server
 */
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => res.json({ "hello": "hi" }))

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