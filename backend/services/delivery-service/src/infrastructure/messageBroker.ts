import amqp from 'amqplib';
import { logger } from './logger';
import { Delivery } from '../domain/entities/Delivery';
import { IDeliveryRepository } from '../domain/repositories/IDeliveryRepository';
import { MessagePublisher } from './messageBroker/MessagePublisher';
import { setTimeout as sleep } from 'timers/promises';

const MAX_RETRIES = 3;

let deliveryRepository: IDeliveryRepository;
export let channel: amqp.Channel;

export async function setupMessageBroker(repo: IDeliveryRepository) {
  deliveryRepository = repo;

  const RABBITMQ_URI = process.env.RABBITMQ_URI;
  if (!RABBITMQ_URI) {
    logger.error('RABBITMQ_URI is not defined');
    return;
  }

  try {
    logger.info(`Connecting to RabbitMQ at: ${RABBITMQ_URI}!!`);

    const connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();

    await channel.assertExchange('packaroo.events', 'topic', { durable: true });

    await setupPackageUpdatedConsumer();
    await setupPackageCreatedConsumer();

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      reconnect();
    });

    logger.info('RabbitMQ connected and consumers initialized.');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
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

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, 'packaroo.events', routingKey);

  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info(`Received package update: ${JSON.stringify(content)}`);
        // Optionally handle the update here...
        channel.ack(msg);
        return;
      } catch (err) {
        logger.error(`Error processing update (attempt ${retries + 1}):`, err);
        retries++;
        if (retries < MAX_RETRIES) await sleep(2 ** retries * 1000);
      }
    }

    logger.warn('Max retries reached. Nacking message.');
    channel.nack(msg, false, false);
  }, { noAck: false });
}

async function setupPackageCreatedConsumer() {
  const queue = 'delivery-service.package-created';
  const routingKey = 'package.created';

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, 'packaroo.events', routingKey);

  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info(`Received package created event: ${JSON.stringify(content)}`);

        const newDelivery: Delivery = {
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

        const publisher = new MessagePublisher();
        await publisher.publish('delivery.created', {
          id: created.id,
          packageId: created.packageId,
          status: created.status,
          trackingId: created.trackingId
        });

        channel.ack(msg);
        return;
      } catch (err) {
        logger.error(`Delivery creation failed (attempt ${retries + 1}):`, err);
        retries++;
        if (retries < MAX_RETRIES) await sleep(2 ** retries * 1000);
      }
    }

    logger.warn('Max retries reached. Nacking message.');
    channel.nack(msg, false, false);
  }, { noAck: false });
}
