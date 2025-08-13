
import { Delivery } from '../entities/Delivery';

export interface IDeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByDriverId(driverId: string): Promise<Delivery[]>;
  findByOwnerId(ownerId: string): Promise<Delivery[]>;
  findByPackageId(packageId: string): Promise<Delivery | null>;
  create(delivery: Delivery): Promise<Delivery>;
  update(id: string, delivery: Partial<Delivery>): Promise<Delivery | null>;
  delete(id: string): Promise<boolean>;
  findPending(): Promise<Delivery[]>;
}
