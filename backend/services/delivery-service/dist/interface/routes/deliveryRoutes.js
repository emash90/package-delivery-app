"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRoutes = void 0;
const express_1 = require("express");
const deliveryController_1 = require("../controllers/deliveryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const permissions_1 = require("../../shared/constants/permissions");
const DeliveryService_1 = require("../../application/services/DeliveryService");
const DeliveryRepository_1 = require("../../infrastructure/repositories/DeliveryRepository");
const MessagePublisher_1 = require("../../infrastructure/messageBroker/MessagePublisher");
const router = (0, express_1.Router)();
exports.deliveryRoutes = router;
const deliveryRepository = new DeliveryRepository_1.DeliveryRepository();
const messagePublisher = new MessagePublisher_1.MessagePublisher();
const deliveryService = new DeliveryService_1.DeliveryService(deliveryRepository, messagePublisher);
const deliveryController = new deliveryController_1.DeliveryController(deliveryService);
// Driver routes
router.get('/', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_READ), deliveryController.getPendingDeliveries);
router.get('/driver', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_READ), deliveryController.getDriverDeliveries);
router.get('/driver/completed', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_READ), deliveryController.getDriverCompletedDeliveries);
router.post('/:id/start', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_CLAIM), deliveryController.startDelivery);
router.post('/:id/complete', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_COMPLETE), deliveryController.completeDelivery);
router.post('/:id/issue', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_UPDATE), deliveryController.reportIssue);
// Owner routes
router.get('/owner', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_READ), rbacMiddleware_1.checkDeliveryOwnership, deliveryController.getOwnerDeliveries);
// Package-specific routes (for carrier info)
router.get('/package/:packageId', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.DELIVERIES_READ), deliveryController.getDeliveryByPackage);
