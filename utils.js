const { MESSAGE_TYPES } = require("./constants");
/**
 * It will validate all incoming and outgoing
 * messages and will throw error on failure
 * @param {Object} message 
 */
const validateMessage = (message) => {
    if (!message) {
        throw new Error("Empty messages are not allowed")
    }
    if (!message.type) {
        throw new Error("Attribute {type} is missing")
    }
    if (!message.id) {
        throw new Error("Attribute {id} is missing")
    }
    if (!Object.keys(MESSAGE_TYPES).includes(message.type)) {
        throw new Error("Invalid value in {type} attribute");
    }
    return message;
}

/**
 * create an acknowledgement message on every incoming message
 * @param {Object} message 
 */
const createAcknowledgement = (message) => {
    return {
        type: MESSAGE_TYPES.ACKNOWLEDGMENT,
        id: message.id
    }
}

/**
 * this will create an error message object
 * which will be sent back to the sender
 * detailing what has happened
 * @param {Object} message 
 */
const createErrorMessage = (message, error) => {
    return {
        type: MESSAGE_TYPES.ERROR,
        of: message,
        error: {
            message: error.message,
            code: error.code
        }
    }
}


/**
 * Place a proper check and balance on each
 * connection and destroy the broken connections\
 * @param {WebSocket.Server}
 */
const cleanupConnections = (wss) => {
    /**
     * mark every new connection an alive flag
     * and register pong listener to mark it alive again
     */
    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.on('pong', () => {
            debug("Connection is alive");
            ws.isAlive = true; // yes connection is alive and mark it alive
        });
    });

    /**
     * create an interval to constanctly check
     * for connections health
     */
    const interval = setInterval(() => {
        debug("Checking for connections health...");
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false; // temporarily mark it dead
            ws.ping(() => { }); // now send a ping to check the connection status
        });
    }, process.env.CONNECTIONS_CLEANUP_INTERVAL || 30000);

    /**
     * on closing of server destroy
     * the interval too
     */
    wss.on('close', () => {
        clearInterval(interval);
    });
}


const authenticate = async (request) => {
    //logic to authenticate
    //on failure to authenticate throw errors
    return request;
}




module.exports = {
    validateMessage,
    createAcknowledgement,
    createErrorMessage,
    cleanupConnections,
    authenticate
};