
import { Delivery } from '../../entities/Delivery';
import { IDeliveryRepository } from '../../repositories/IDeliveryRepository';

export class GetDriverDeliveriesUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(driverId: string): Promise<Delivery[]> {
    return this.deliveryRepository.findByDriverId(driverId);
  }
}
