
import { Delivery } from '../entities/Delivery';

export interface IDeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByDriverId(driverId: string): Promise<Delivery[]>;
  findByOwnerId(ownerId: string): Promise<Delivery[]>;
  create(delivery: Delivery): Promise<Delivery>;
  update(id: string, delivery: Partial<Delivery>): Promise<Delivery | null>;
  delete(id: string): Promise<boolean>;
}
