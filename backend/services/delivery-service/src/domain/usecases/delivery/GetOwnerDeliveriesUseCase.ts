
import { Delivery } from '../../entities/Delivery';
import { IDeliveryRepository } from '../../repositories/IDeliveryRepository';

export class GetOwnerDeliveriesUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(ownerId: string): Promise<Delivery[]> {
    return this.deliveryRepository.findByOwnerId(ownerId);
  }
}
