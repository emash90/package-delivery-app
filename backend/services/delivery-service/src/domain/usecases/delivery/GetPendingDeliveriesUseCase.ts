import { Delivery } from '../../entities/Delivery';
import { IDeliveryRepository } from '../../repositories/IDeliveryRepository';

export class GetPendingDeliveriesUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(): Promise<Delivery[]> {
    return this.deliveryRepository.findPending('pending');
  }
}
