"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePublisher = void 0;
exports.setupMessageBroker = setupMessageBroker;
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = require("./logger");
let channel;
async function setupMessageBroker() {
    try {
        const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
        const connection = await amqplib_1.default.connect(RABBITMQ_URI);
        channel = await connection.createChannel();
        // Declare exchanges
        await channel.assertExchange('packaroo.user-events', 'topic', { durable: true });
        logger_1.logger.info('Connected to RabbitMQ (User Service)');
        connection.on('error', (err) => {
            logger_1.logger.error('RabbitMQ connection error:', err);
            setTimeout(setupMessageBroker, 15000);
        });
        return channel;
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to RabbitMQ:', error);
        setTimeout(setupMessageBroker, 5000);
        throw error;
    }
}
class MessagePublisher {
    async publish(routingKey, message) {
        if (!channel) {
            throw new Error('RabbitMQ channel is not initialized');
        }
        const exchange = 'packaroo.user-events';
        const content = Buffer.from(JSON.stringify(message));
        try {
            channel.publish(exchange, routingKey, content, {
                contentType: 'application/json',
                persistent: true
            });
            logger_1.logger.info(`User event published to ${exchange} with routing key ${routingKey}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to publish user event:', error);
            throw error;
        }
    }
}
exports.MessagePublisher = MessagePublisher;
