
import amqp from 'amqplib';
import { logger } from './logger';

let channel: amqp.Channel;

export async function setupMessageBroker() {
  try {
    const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
    const connection = await amqp.connect(RABBITMQ_URI);
    
    channel = await connection.createChannel();
    
    // Declare exchanges
    await channel.assertExchange('packaroo.events', 'topic', { durable: true });
    
    // Declare queues and bind to exchange
    await channel.assertQueue('delivery-service.package-updates', { durable: true });
    await channel.bindQueue('delivery-service.package-updates', 'packaroo.events', 'package.updated');
    
    // Set up consumer for package updates
    channel.consume('delivery-service.package-updates', async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          logger.info(`Received package update: ${JSON.stringify(content)}`);
          
          // Process package update (update delivery status, etc.)
          // Implementation would go here
          
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing package update:', error);
          channel.nack(msg, false, true);
        }
      }
    });
    
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
