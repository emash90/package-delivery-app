"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePublisher = void 0;
const logger_1 = require("../logger");
const messageBroker_1 = require("../messageBroker");
class MessagePublisher {
    async publish(routingKey, message) {
        const exchange = 'packaroo.events';
        const content = Buffer.from(JSON.stringify(message));
        try {
            messageBroker_1.channel.publish(exchange, routingKey, content, {
                contentType: 'application/json',
                persistent: true
            });
            logger_1.logger.info(`Publishing message to ${exchange} with routing key ${routingKey}:`, message);
        }
        catch (error) {
            logger_1.logger.error(`Error publishing message to ${routingKey}:`, error);
            throw error;
        }
    }
}
exports.MessagePublisher = MessagePublisher;
