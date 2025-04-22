
import amqp from 'amqplib';
import { logger } from './logger';
import { Delivery } from '../domain/entities/Delivery'
import { IDeliveryRepository } from '../domain/repositories/IDeliveryRepository'
import { MessagePublisher } from './messageBroker/MessagePublisher'



let deliveryRepository: IDeliveryRepository;


export let channel: amqp.Channel;

export async function setupMessageBroker(repo: IDeliveryRepository) {
  try {
    const RABBITMQ_URI = process.env.RABBITMQ_URI;
    if (!RABBITMQ_URI) {
      throw new Error('RABBITMQ_URI environment variable is not set');
    }

    logger.info(`Connecting to RabbitMQ at: ${RABBITMQ_URI}`);
    
    const connection = await amqp.connect(RABBITMQ_URI);
    deliveryRepository = repo;
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('packaroo.events', 'topic', { durable: true });
    
    // Declare queues and bind to exchange
    await channel.assertQueue('delivery-service.package-updates', { durable: true });
    await channel.bindQueue('delivery-service.package-updates', 'packaroo.events', 'package.updated');
    
    // Set up consumer for package updates
    await channel.consume('delivery-service.package-updates', async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(`Received package update: ${JSON.stringify(content)}`);
                
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing package update:', error);
          channel.nack(msg, false, true);
        }
      }
    }, { noAck: false });
    
    // Declare queue for package creation and bind to exchange with correct routing key
    await channel.assertQueue('delivery-service.package-created', { durable: true });
    await channel.bindQueue('delivery-service.package-created', 'packaroo.events', 'package.created');


    // Consumer for package creation
    await channel.consume('delivery-service.package-created', async (msg) => {

      if (!msg) return;
      console.log("package created", msg)
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(`Received package created event: ${JSON.stringify(content)}`);
          console.log("package created", content)
          // Create a new delivery based on the package
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

          const createdDelivery = await deliveryRepository.create(newDelivery);

          // Publish delivery.created event
          const publisher = new MessagePublisher();
          await publisher.publish('delivery.created', {
            id: createdDelivery.id,
            packageId: createdDelivery.packageId,
            status: createdDelivery.status,
            trackingId: createdDelivery.trackingId
          });

          channel.ack(msg);
        } catch (error) {
          logger.error('Delivery creation failed:', error);
          channel.nack(msg, false, false);
        }
    }, { noAck: false });
    
    logger.info('Connected to RabbitMQ');
    
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(setupMessageBroker, 5000);
    });
    
    return channel;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
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
