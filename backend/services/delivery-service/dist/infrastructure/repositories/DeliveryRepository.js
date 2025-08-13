"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRepository = void 0;
const DeliveryModel_1 = require("../models/DeliveryModel");
const logger_1 = require("../logger");
class DeliveryRepository {
    async findById(id) {
        try {
            const delivery = await DeliveryModel_1.DeliveryModel.findById(id);
            return delivery ? delivery.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error finding delivery by ID:', error);
            throw error;
        }
    }
    async findByDriverId(driverId) {
        try {
            const deliveries = await DeliveryModel_1.DeliveryModel.find({ driverId });
            return deliveries.map(delivery => delivery.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding deliveries by driver ID:', error);
            throw error;
        }
    }
    async findByOwnerId(ownerId) {
        try {
            const deliveries = await DeliveryModel_1.DeliveryModel.find({ ownerId });
            return deliveries.map(delivery => delivery.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding deliveries by owner ID:', error);
            throw error;
        }
    }
    async create(delivery) {
        try {
            const newDelivery = await DeliveryModel_1.DeliveryModel.create(delivery);
            return newDelivery.toJSON();
        }
        catch (error) {
            logger_1.logger.error('Error creating delivery:', error);
            throw error;
        }
    }
    async update(id, delivery) {
        try {
            const updatedDelivery = await DeliveryModel_1.DeliveryModel.findByIdAndUpdate(id, delivery, { new: true });
            return updatedDelivery ? updatedDelivery.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating delivery:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await DeliveryModel_1.DeliveryModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting delivery:', error);
            throw error;
        }
    }
    async findByPackageId(packageId) {
        try {
            const delivery = await DeliveryModel_1.DeliveryModel.findOne({ packageId });
            return delivery ? delivery.toJSON() : null;
        }
        catch (error) {
            logger_1.logger.error('Error finding delivery by package ID:', error);
            throw error;
        }
    }
    async findPending() {
        try {
            const deliveries = await DeliveryModel_1.DeliveryModel.find({
                status: { $in: ['pending', 'in transit'] }
            });
            return deliveries.map(delivery => delivery.toJSON());
        }
        catch (error) {
            logger_1.logger.error('Error finding pending deliveries:', error);
            throw error;
        }
    }
}
exports.DeliveryRepository = DeliveryRepository;
