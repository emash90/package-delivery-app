
import { Delivery } from '../../domain/entities/Delivery';
import { IDeliveryRepository } from '../../domain/repositories/IDeliveryRepository';
import { DeliveryModel } from '../models/DeliveryModel';
import { logger } from '../logger';

export class DeliveryRepository implements IDeliveryRepository {
  async findById(id: string): Promise<Delivery | null> {
    try {
      const delivery = await DeliveryModel.findById(id);
      return delivery ? delivery.toJSON() as Delivery : null;
    } catch (error) {
      logger.error('Error finding delivery by ID:', error);
      throw error;
    }
  }

  async findByDriverId(driverId: string): Promise<Delivery[]> {
    try {
      const deliveries = await DeliveryModel.find({ driverId });
      return deliveries.map(delivery => delivery.toJSON() as Delivery);
    } catch (error) {
      logger.error('Error finding deliveries by driver ID:', error);
      throw error;
    }
  }

  async findByOwnerId(ownerId: string): Promise<Delivery[]> {
    try {
      const deliveries = await DeliveryModel.find({ ownerId });
      return deliveries.map(delivery => delivery.toJSON() as Delivery);
    } catch (error) {
      logger.error('Error finding deliveries by owner ID:', error);
      throw error;
    }
  }

  async create(delivery: Delivery): Promise<Delivery> {
    try {
      const newDelivery = await DeliveryModel.create(delivery);
      return newDelivery.toJSON() as Delivery;
    } catch (error) {
      logger.error('Error creating delivery:', error);
      throw error;
    }
  }

  async update(id: string, delivery: Partial<Delivery>): Promise<Delivery | null> {
    try {
      const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
        id,
        delivery,
        { new: true }
      );
      return updatedDelivery ? updatedDelivery.toJSON() as Delivery : null;
    } catch (error) {
      logger.error('Error updating delivery:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await DeliveryModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting delivery:', error);
      throw error;
    }
  }

  async findPending(status: String): Promise<Delivery[]> {
    try {
      const deliveries = await DeliveryModel.find({
        status: { $in: ['pending', 'in transit'] }
      });
      return deliveries.map(delivery => delivery.toJSON() as Delivery);
      } catch (error) {
      logger.error('Error finding pending deliveries:', error);
      throw error;
    }
  }



}
