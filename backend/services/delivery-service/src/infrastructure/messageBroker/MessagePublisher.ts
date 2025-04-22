
import { IMessagePublisher } from '../../application/services/IMessagePublisher';
import { logger } from '../logger';
import { channel } from '../messageBroker';


export class MessagePublisher implements IMessagePublisher {
  async publish(routingKey: string, message: any): Promise<void> {

      const exchange = 'packaroo.events';
      const content = Buffer.from(JSON.stringify(message));
      try {
        channel.publish(exchange, routingKey, content, {
          contentType: 'application/json',
          persistent: true
        });

        logger.info(`Publishing message to ${exchange} with routing key ${routingKey}:`, message);
    } catch (error) {
      logger.error(`Error publishing message to ${routingKey}:`, error);
      throw error;
    }
  }
}
