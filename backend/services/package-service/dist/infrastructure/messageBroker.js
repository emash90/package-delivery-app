"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
exports.setupMessageBroker = setupMessageBroker;
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = require("./logger");
const PackageRepository_1 = require("./repositories/PackageRepository");
async function setupMessageBroker() {
    try {
        const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
        const connection = await amqplib_1.default.connect(RABBITMQ_URI);
        exports.channel = await connection.createChannel();
        // Declare exchanges
        await exports.channel.assertExchange('packaroo.events', 'topic', { durable: true });
        // Declare queues and bind to exchange
        await exports.channel.assertQueue('package-service.delivery-updates', { durable: true });
        await exports.channel.bindQueue('package-service.delivery-updates', 'packaroo.events', 'delivery.updated');
        const packageRepository = new PackageRepository_1.PackageRepository();
        // Set up consumer for delivery updates
        exports.channel.consume('package-service.delivery-updates', async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    logger_1.logger.info(`Received delivery update: ${JSON.stringify(content)}`);
                    // Process delivery update (update package status, location, etc.)
                    if (content.packageId && content.status) {
                        let packageStatus;
                        // Map delivery status to package status
                        switch (content.status) {
                            case 'in transit':
                                packageStatus = 'in transit';
                                break;
                            case 'delivered':
                                packageStatus = 'delivered';
                                break;
                            case 'failed':
                                packageStatus = 'cancelled';
                                break;
                            default:
                                packageStatus = 'processing';
                        }
                        // Update the package with the new status
                        await packageRepository.update(content.packageId, {
                            status: packageStatus,
                            lastUpdate: new Date()
                        });
                        logger_1.logger.info(`Updated package ${content.packageId} status to ${packageStatus}`);
                    }
                    exports.channel.ack(msg);
                }
                catch (error) {
                    logger_1.logger.error('Error processing delivery update:', error);
                    exports.channel.nack(msg, false, true);
                }
            }
        });
        logger_1.logger.info('Connected to RabbitMQ');
        connection.on('error', (err) => {
            logger_1.logger.error('RabbitMQ connection error:', err);
            setTimeout(setupMessageBroker, 5000);
        });
        return exports.channel;
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to RabbitMQ:', error);
        setTimeout(setupMessageBroker, 5000);
        throw error;
    }
}
// export class MessagePublisher {
//   async publish(routingKey: string, message: any): Promise<void> {
//     if (!channel) {
//       throw new Error('RabbitMQ channel is not initialized');
//     }
//     const exchange = 'packaroo.events';
//     const content = Buffer.from(JSON.stringify(message));
//     try {
//       channel.publish(exchange, routingKey, content, {
//         contentType: 'application/json',
//         persistent: true
//       });
//       logger.info(`Message published to ${exchange} with routing key ${routingKey}`);
//     } catch (error) {
//       logger.error('Failed to publish message:', error);
//       throw error;
//     }
//   }
// }
