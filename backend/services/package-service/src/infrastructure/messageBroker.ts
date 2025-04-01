import amqp from 'amqplib';
import { logger } from './logger';

let channel: amqp.Channel;
const MAX_RETRIES = 2; // Number of retry attempts
const RETRY_DELAY_MS = 5000; // Delay between retries in milliseconds

export async function setupMessageBroker(retries = 0): Promise<void> {
  try {
    const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
    const connection = await amqp.connect(RABBITMQ_URI);
    
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('packaroo.events', 'topic', { durable: true });
    
    // Declare queues and bind to exchange
    await channel.assertQueue('package-service.delivery-updates', { durable: true });
    await channel.bindQueue('package-service.delivery-updates', 'packaroo.events', 'delivery.updated');
    
    // Set up consumer for delivery updates
    channel.consume('package-service.delivery-updates', async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(`Received delivery update: ${JSON.stringify(content)}`);
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing delivery update:', error);
          channel.nack(msg, false, true);
        }
      }
    });

    logger.info('Connected to RabbitMQ');

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(() => setupMessageBroker(0), RETRY_DELAY_MS);
    });

  } catch (error) {
    logger.error(`Failed to connect to RabbitMQ (attempt ${retries + 1}/${MAX_RETRIES}):`, error);

    if (retries < MAX_RETRIES) {
      logger.info(`Retrying RabbitMQ connection in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return setupMessageBroker(retries + 1);
    }

    logger.error('Max retries reached. Could not connect to RabbitMQ.');
    process.exit(1); // Exit the process if max retries are reached
  }
}

/**
 * Message Publisher Class
 */
export class MessagePublisher {
  async publish(routingKey: string, message: any): Promise<void> {
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    
    const exchange = 'packaroo.events';
    const content = Buffer.from(JSON.stringify(message));
    
    try {
      channel.publish(exchange, routingKey, content, {
        contentType: 'application/json',
        persistent: true
      });
      
      logger.info(`Message published to ${exchange} with routing key ${routingKey}`);
    } catch (error) {
      logger.error('Failed to publish message:', error);
      throw error;
    }
  }
}
