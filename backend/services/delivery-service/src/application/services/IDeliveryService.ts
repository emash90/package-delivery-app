
import { Delivery, DeliveryStatus } from '../../domain/entities/Delivery';

export interface IDeliveryService {
  getDriverDeliveries(driverId: string): Promise<Delivery[]>;
  getOwnerDeliveries(ownerId: string): Promise<Delivery[]>;
  startDelivery(deliveryId: string, driverId: string): Promise<Delivery | null>;
  completeDelivery(deliveryId: string, driverId: string): Promise<Delivery | null>;
  reportIssue(deliveryId: string, issue: string): Promise<Delivery | null>;
  getPendingDeliveries(status: String): Promise<Delivery[]>;
}
