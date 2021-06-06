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




module.exports = {
    validateMessage,
    createAcknowledgement,
    createErrorMessage
};