
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { logger } from '../../infrastructure/logger';
import { IDeliveryService } from '../../application/services/IDeliveryService';

export class DeliveryController {
  constructor(private deliveryService: IDeliveryService) {}

  getDriverDeliveries = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user?.id;
      
      if (req.user?.role !== 'driver') {
        return res.status(403).json({ message: 'Access denied: Driver role required' });
      }
      
      const deliveries = await this.deliveryService.getDriverDeliveries(driverId as string);
      res.status(200).json(deliveries);
    } catch (error) {
      logger.error('Error fetching driver deliveries:', error);
      res.status(500).json({ message: 'Failed to fetch deliveries' });
    }
  };

  getOwnerDeliveries = async (req: AuthRequest, res: Response) => {
    try {
      const ownerId = req.user?.id;
      
      if (req.user?.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied: Owner role required' });
      }
      
      const deliveries = await this.deliveryService.getOwnerDeliveries(ownerId as string);
      res.status(200).json(deliveries);
    } catch (error) {
      logger.error('Error fetching owner deliveries:', error);
      res.status(500).json({ message: 'Failed to fetch deliveries' });
    }
  };

  startDelivery = async (req: AuthRequest, res: Response) => {
    try {
      const deliveryId = req.params.id;
      const driverId = req.user?.id;
      
      if (req.user?.role !== 'driver') {
        return res.status(403).json({ message: 'Access denied: Driver role required' });
      }
      
      const delivery = await this.deliveryService.startDelivery(deliveryId, driverId as string);
      
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
      
      res.status(200).json(delivery);
    } catch (error) {
      logger.error('Error starting delivery:', error);
      res.status(500).json({ message: 'Failed to start delivery' });
    }
  };

  completeDelivery = async (req: AuthRequest, res: Response) => {
    try {
      const deliveryId = req.params.id;
      const driverId = req.user?.id;
      
      if (req.user?.role !== 'driver') {
        return res.status(403).json({ message: 'Access denied: Driver role required' });
      }
      
      const delivery = await this.deliveryService.completeDelivery(deliveryId, driverId as string);
      
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
      
      res.status(200).json(delivery);
    } catch (error) {
      logger.error('Error completing delivery:', error);
      res.status(500).json({ message: 'Failed to complete delivery' });
    }
  };

  reportIssue = async (req: AuthRequest, res: Response) => {
    try {
      const deliveryId = req.params.id;
      const { issue } = req.body;
      
      if (!issue) {
        return res.status(400).json({ message: 'Issue description is required' });
      }
      
      const delivery = await this.deliveryService.reportIssue(deliveryId, issue);
      
      if (!delivery) {
        return res.status(404).json({ message: 'Delivery not found' });
      }
      
      res.status(200).json(delivery);
    } catch (error) {
      logger.error('Error reporting delivery issue:', error);
      res.status(500).json({ message: 'Failed to report delivery issue' });
    }
  };

  getPendingDeliveries = async (req: AuthRequest, res: Response) => {
    try {
      const deliveries = await this.deliveryService.getPendingDeliveries('pending');
      res.status(200).json(deliveries);
    } catch (error) {
      logger.error('Error fetching pending deliveries:', error);
      res.status(500).json({ message: 'Failed to fetch pending deliveries' });
    }
  };


}



