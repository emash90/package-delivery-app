
import { Delivery, DeliveryStatus } from '../../domain/entities/Delivery';

export interface IDeliveryService {
  getDriverDeliveries(driverId: string): Promise<Delivery[]>;
  getDriverCompletedDeliveries(driverId: string): Promise<Delivery[]>;
  getOwnerDeliveries(ownerId: string): Promise<Delivery[]>;
  getDeliveryById(deliveryId: string): Promise<Delivery | null>;
  startDelivery(deliveryId: string, driverId: string): Promise<Delivery | null>;
  completeDelivery(deliveryId: string, driverId: string): Promise<Delivery | null>;
  reportIssue(deliveryId: string, issue: string): Promise<Delivery | null>;
  getPendingDeliveries(): Promise<Delivery[]>;
}
