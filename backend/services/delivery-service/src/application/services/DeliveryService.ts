
import { Delivery, DeliveryStatus } from '../../domain/entities/Delivery';
import { IDeliveryService } from './IDeliveryService';
import { IDeliveryRepository } from '../../domain/repositories/IDeliveryRepository';
import { GetDriverDeliveriesUseCase } from '../../domain/usecases/delivery/GetDriverDeliveriesUseCase';
import { GetOwnerDeliveriesUseCase } from '../../domain/usecases/delivery/GetOwnerDeliveriesUseCase';
import { UpdateDeliveryStatusUseCase } from '../../domain/usecases/delivery/UpdateDeliveryStatusUseCase';
import { MessagePublisher } from '../../infrastructure/messageBroker';

export class DeliveryService implements IDeliveryService {
  private getDriverDeliveriesUseCase: GetDriverDeliveriesUseCase;
  private getOwnerDeliveriesUseCase: GetOwnerDeliveriesUseCase;
  private updateDeliveryStatusUseCase: UpdateDeliveryStatusUseCase;
  
  constructor(
    private deliveryRepository: IDeliveryRepository,
    private messagePublisher: MessagePublisher
  ) {
    this.getDriverDeliveriesUseCase = new GetDriverDeliveriesUseCase(deliveryRepository);
    this.getOwnerDeliveriesUseCase = new GetOwnerDeliveriesUseCase(deliveryRepository);
    this.updateDeliveryStatusUseCase = new UpdateDeliveryStatusUseCase(
      deliveryRepository,
      messagePublisher
    );
  }
  
  async getDriverDeliveries(driverId: string): Promise<Delivery[]> {
    return this.getDriverDeliveriesUseCase.execute(driverId);
  }
  
  async getOwnerDeliveries(ownerId: string): Promise<Delivery[]> {
    return this.getOwnerDeliveriesUseCase.execute(ownerId);
  }
  
  async startDelivery(deliveryId: string, driverId: string): Promise<Delivery | null> {
    return this.updateDeliveryStatusUseCase.execute(deliveryId, 'in transit', driverId);
  }
  
  async completeDelivery(deliveryId: string, driverId: string): Promise<Delivery | null> {
    return this.updateDeliveryStatusUseCase.execute(deliveryId, 'delivered', driverId);
  }
  
  async reportIssue(deliveryId: string, issue: string): Promise<Delivery | null> {
    const delivery = await this.deliveryRepository.findById(deliveryId);
    
    if (!delivery) {
      return null;
    }
    
    return this.deliveryRepository.update(deliveryId, {
      status: 'failed',
      issue
    });
  }
}
