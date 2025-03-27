
import { Delivery, DeliveryStatus } from '../../entities/Delivery';
import { IDeliveryRepository } from '../../repositories/IDeliveryRepository';
import { MessagePublisher } from '../../../infrastructure/messageBroker';

export class UpdateDeliveryStatusUseCase {
  constructor(
    private deliveryRepository: IDeliveryRepository,
    private messagePublisher: MessagePublisher
  ) {}

  async execute(deliveryId: string, status: DeliveryStatus, driverId?: string): Promise<Delivery | null> {
    const delivery = await this.deliveryRepository.findById(deliveryId);
    
    if (!delivery) {
      return null;
    }
    
    const updatedDelivery = await this.deliveryRepository.update(deliveryId, {
      status,
      ...(status === 'in transit' && { startTime: new Date() }),
      ...(status === 'delivered' && { endTime: new Date(), actualDeliveryTime: new Date() }),
      ...(driverId && { driverId })
    });
    
    if (updatedDelivery) {
      // Publish delivery updated event for other services
      await this.messagePublisher.publish('delivery.updated', {
        id: updatedDelivery.id,
        packageId: updatedDelivery.packageId,
        status: updatedDelivery.status
      });
    }
    
    return updatedDelivery;
  }
}
