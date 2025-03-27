
import { Router } from 'express';
import { DeliveryController } from '../controllers/deliveryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { DeliveryService } from '../../application/services/DeliveryService';
import { DeliveryRepository } from '../../infrastructure/repositories/DeliveryRepository';
import { MessagePublisher } from '../../infrastructure/messageBroker';

const router = Router();
const deliveryRepository = new DeliveryRepository();
const messagePublisher = new MessagePublisher();
const deliveryService = new DeliveryService(deliveryRepository, messagePublisher);
const deliveryController = new DeliveryController(deliveryService);

// Driver routes
router.get('/driver', authMiddleware, deliveryController.getDriverDeliveries);
router.post('/:id/start', authMiddleware, deliveryController.startDelivery);
router.post('/:id/complete', authMiddleware, deliveryController.completeDelivery);
router.post('/:id/issue', authMiddleware, deliveryController.reportIssue);

// Owner routes
router.get('/owner', authMiddleware, deliveryController.getOwnerDeliveries);

export { router as deliveryRoutes };
