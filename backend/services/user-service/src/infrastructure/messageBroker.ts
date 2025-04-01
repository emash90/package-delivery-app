import amqp from 'amqplib';
import { logger } from './logger';

let channel: amqp.Channel;

export async function setupMessageBroker() {
  try {
    const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
    const connection = await amqp.connect(RABBITMQ_URI);
    
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('packaroo.user-events', 'topic', { durable: true });

    logger.info('Connected to RabbitMQ (User Service)');

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(setupMessageBroker, 15000);
    });

    return channel;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    setTimeout(setupMessageBroker, 5000);
    throw error;
  }
}

export class MessagePublisher {
  async publish(routingKey: string, message: any): Promise<void> {
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
      
      logger.info(`User event published to ${exchange} with routing key ${routingKey}`);
    } catch (error) {
      logger.error('Failed to publish user event:', error);
      throw error;
    }
  }
}
