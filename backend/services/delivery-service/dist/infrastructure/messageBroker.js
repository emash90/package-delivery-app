"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = void 0;
exports.setupMessageBroker = setupMessageBroker;
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = require("./logger");
const MessagePublisher_1 = require("./messageBroker/MessagePublisher");
const promises_1 = require("timers/promises");
const MAX_RETRIES = 3;
let deliveryRepository;
async function setupMessageBroker(repo) {
    deliveryRepository = repo;
    const RABBITMQ_URI = process.env.RABBITMQ_URI;
    if (!RABBITMQ_URI) {
        logger_1.logger.error('RABBITMQ_URI is not defined');
        return;
    }
    try {
        logger_1.logger.info(`Connecting to RabbitMQ at: ${RABBITMQ_URI}!!`);
        const connection = await amqplib_1.default.connect(RABBITMQ_URI);
        exports.channel = await connection.createChannel();
        await exports.channel.assertExchange('packaroo.events', 'topic', { durable: true });
        await setupPackageUpdatedConsumer();
        await setupPackageCreatedConsumer();
        connection.on('error', (err) => {
            logger_1.logger.error('RabbitMQ connection error:', err);
            reconnect();
        });
        logger_1.logger.info('RabbitMQ connected and consumers initialized.');
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to RabbitMQ:', error);
        reconnect();
    }
}
function reconnect() {
    setTimeout(() => {
        setupMessageBroker(deliveryRepository);
    }, 5000); // Retry in 5 seconds
}
async function setupPackageUpdatedConsumer() {
    const queue = 'delivery-service.package-updates';
    const routingKey = 'package.updated';
    await exports.channel.assertQueue(queue, { durable: true });
    await exports.channel.bindQueue(queue, 'packaroo.events', routingKey);
    await exports.channel.consume(queue, async (msg) => {
        if (!msg)
            return;
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                const content = JSON.parse(msg.content.toString());
                logger_1.logger.info(`Received package update: ${JSON.stringify(content)}`);
                // Optionally handle the update here...
                exports.channel.ack(msg);
                return;
            }
            catch (err) {
                logger_1.logger.error(`Error processing update (attempt ${retries + 1}):`, err);
                retries++;
                if (retries < MAX_RETRIES)
                    await (0, promises_1.setTimeout)(2 ** retries * 1000);
            }
        }
        logger_1.logger.warn('Max retries reached. Nacking message.');
        exports.channel.nack(msg, false, false);
    }, { noAck: false });
}
async function setupPackageCreatedConsumer() {
    const queue = 'delivery-service.package-created';
    const routingKey = 'package.created';
    await exports.channel.assertQueue(queue, { durable: true });
    await exports.channel.bindQueue(queue, 'packaroo.events', routingKey);
    await exports.channel.consume(queue, async (msg) => {
        if (!msg)
            return;
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                const content = JSON.parse(msg.content.toString());
                logger_1.logger.info(`Received package created event: ${JSON.stringify(content)}`);
                const newDelivery = {
                    packageId: content.id,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    trackingId: content.trackingId,
                    ownerId: content.ownerId,
                    recipientName: content.recipientName,
                    recipientAddress: content.recipientAddress,
                    recipientPhone: content.recipientContact,
                    estimatedDeliveryTime: content.estimatedDeliveryTime,
                    images: content.images,
                    lastUpdate: new Date()
                };
                const created = await deliveryRepository.create(newDelivery);
                const publisher = new MessagePublisher_1.MessagePublisher();
                await publisher.publish('delivery.created', {
                    id: created.id,
                    packageId: created.packageId,
                    status: created.status,
                    trackingId: created.trackingId
                });
                exports.channel.ack(msg);
                return;
            }
            catch (err) {
                logger_1.logger.error(`Delivery creation failed (attempt ${retries + 1}):`, err);
                retries++;
                if (retries < MAX_RETRIES)
                    await (0, promises_1.setTimeout)(2 ** retries * 1000);
            }
        }
        logger_1.logger.warn('Max retries reached. Nacking message.');
        exports.channel.nack(msg, false, false);
    }, { noAck: false });
}
