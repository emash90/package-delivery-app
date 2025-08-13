"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const logger_1 = require("../../infrastructure/logger");
class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
        this.getDriverDeliveries = async (req, res) => {
            var _a, _b;
            try {
                const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'driver') {
                    return res.status(403).json({ message: 'Access denied: Driver role required' });
                }
                const deliveries = await this.deliveryService.getDriverDeliveries(driverId);
                res.status(200).json(deliveries);
            }
            catch (error) {
                logger_1.logger.error('Error fetching driver deliveries:', error);
                res.status(500).json({ message: 'Failed to fetch deliveries' });
            }
        };
        this.getDriverCompletedDeliveries = async (req, res) => {
            var _a, _b;
            try {
                const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'driver') {
                    return res.status(403).json({ message: 'Access denied: Driver role required' });
                }
                const deliveries = await this.deliveryService.getDriverCompletedDeliveries(driverId);
                res.status(200).json(deliveries);
            }
            catch (error) {
                logger_1.logger.error('Error fetching driver completed deliveries:', error);
                res.status(500).json({ message: 'Failed to fetch completed deliveries' });
            }
        };
        this.getOwnerDeliveries = async (req, res) => {
            var _a, _b;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'owner') {
                    return res.status(403).json({ message: 'Access denied: Owner role required' });
                }
                const deliveries = await this.deliveryService.getOwnerDeliveries(ownerId);
                res.status(200).json(deliveries);
            }
            catch (error) {
                logger_1.logger.error('Error fetching owner deliveries:', error);
                res.status(500).json({ message: 'Failed to fetch deliveries' });
            }
        };
        this.startDelivery = async (req, res) => {
            var _a, _b;
            try {
                const deliveryId = req.params.id;
                const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'driver') {
                    return res.status(403).json({ message: 'Access denied: Driver role required' });
                }
                const delivery = await this.deliveryService.startDelivery(deliveryId, driverId);
                if (!delivery) {
                    return res.status(404).json({ message: 'Delivery not found' });
                }
                res.status(200).json(delivery);
            }
            catch (error) {
                logger_1.logger.error('Error starting delivery:', error);
                res.status(500).json({ message: 'Failed to start delivery' });
            }
        };
        this.completeDelivery = async (req, res) => {
            var _a, _b;
            try {
                const deliveryId = req.params.id;
                const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'driver') {
                    return res.status(403).json({ message: 'Access denied: Driver role required' });
                }
                if (!driverId) {
                    return res.status(400).json({ message: 'Driver ID is required' });
                }
                // First check if delivery exists and if driver is assigned to it
                const existingDelivery = await this.deliveryService.getDeliveryById(deliveryId);
                if (!existingDelivery) {
                    return res.status(404).json({ message: 'Delivery not found' });
                }
                // Check if the driver is authorized to complete this delivery
                if (existingDelivery.driverId && existingDelivery.driverId !== driverId) {
                    return res.status(403).json({ message: 'You are not authorized to complete this delivery' });
                }
                const delivery = await this.deliveryService.completeDelivery(deliveryId, driverId);
                if (!delivery) {
                    return res.status(404).json({ message: 'Delivery not found or could not be completed' });
                }
                res.status(200).json({
                    ...delivery,
                    message: 'Delivery completed successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Error completing delivery:', error);
                // Send specific error messages for validation errors
                if (error instanceof Error && error.message.includes('must be in transit')) {
                    return res.status(400).json({
                        message: 'Delivery must be in transit before it can be completed'
                    });
                }
                if (error instanceof Error && error.message.includes('Driver ID is required')) {
                    return res.status(400).json({
                        message: 'Driver ID is required to complete delivery'
                    });
                }
                res.status(500).json({ message: 'Failed to complete delivery' });
            }
        };
        this.reportIssue = async (req, res) => {
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
            }
            catch (error) {
                logger_1.logger.error('Error reporting delivery issue:', error);
                res.status(500).json({ message: 'Failed to report delivery issue' });
            }
        };
        this.getPendingDeliveries = async (req, res) => {
            try {
                const deliveries = await this.deliveryService.getPendingDeliveries();
                res.status(200).json(deliveries);
            }
            catch (error) {
                logger_1.logger.error('Error fetching pending deliveries:', error);
                res.status(500).json({ message: 'Failed to fetch pending deliveries' });
            }
        };
        this.getDeliveryByPackage = async (req, res) => {
            try {
                const { packageId } = req.params;
                if (!packageId) {
                    return res.status(400).json({ message: 'Package ID is required' });
                }
                const delivery = await this.deliveryService.getDeliveryByPackageId(packageId);
                if (!delivery) {
                    return res.status(404).json({ message: 'No delivery found for this package' });
                }
                res.status(200).json(delivery);
            }
            catch (error) {
                logger_1.logger.error('Error fetching delivery by package:', error);
                res.status(500).json({ message: 'Failed to fetch delivery information' });
            }
        };
    }
}
exports.DeliveryController = DeliveryController;
