
export interface IMessagePublisher {
  publish(routingKey: string, message: any): Promise<void>;
}
