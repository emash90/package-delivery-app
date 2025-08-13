
import { Router } from 'express';
import { DeliveryController } from '../controllers/deliveryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePermission, requireAnyPermission, checkDeliveryOwnership } from '../middlewares/rbacMiddleware';
import { PERMISSIONS } from '../../shared/constants/permissions';
import { DeliveryService } from '../../application/services/DeliveryService';
import { DeliveryRepository } from '../../infrastructure/repositories/DeliveryRepository';
import { MessagePublisher } from '../../infrastructure/messageBroker/MessagePublisher'

const router = Router();
const deliveryRepository = new DeliveryRepository();
const messagePublisher = new MessagePublisher();
const deliveryService = new DeliveryService(deliveryRepository, messagePublisher);
const deliveryController = new DeliveryController(deliveryService);

// Driver routes
router.get('/', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_READ), deliveryController.getPendingDeliveries)
router.get('/driver', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_READ), deliveryController.getDriverDeliveries);
router.get('/driver/completed', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_READ), deliveryController.getDriverCompletedDeliveries);
router.post('/:id/start', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_CLAIM), deliveryController.startDelivery);
router.post('/:id/complete', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_COMPLETE), deliveryController.completeDelivery);
router.post('/:id/issue', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_UPDATE), deliveryController.reportIssue);

// Owner routes
router.get('/owner', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_READ), checkDeliveryOwnership, deliveryController.getOwnerDeliveries);

// Package-specific routes (for carrier info)
router.get('/package/:packageId', authMiddleware, requirePermission(PERMISSIONS.DELIVERIES_READ), deliveryController.getDeliveryByPackage);

export { router as deliveryRoutes };
