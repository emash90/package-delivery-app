"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeliveryStatusUseCase = void 0;
class UpdateDeliveryStatusUseCase {
    constructor(deliveryRepository, messagePublisher) {
        this.deliveryRepository = deliveryRepository;
        this.messagePublisher = messagePublisher;
    }
    async execute(deliveryId, status, driverId) {
        const delivery = await this.deliveryRepository.findById(deliveryId);
        if (!delivery) {
            return null;
        }
        // Validate status transitions
        if (status === 'delivered' && delivery.status !== 'in transit') {
            throw new Error('Delivery must be in transit before it can be completed');
        }
        if (status === 'in transit' && delivery.status !== 'pending' && delivery.status !== 'assigned') {
            throw new Error('Delivery must be pending or assigned before it can be started');
        }
        const now = new Date();
        const updateData = {
            status,
            updatedAt: now,
            lastUpdate: now
        };
        // Handle status-specific updates
        if (status === 'in transit') {
            updateData.startTime = now;
            if (driverId) {
                updateData.driverId = driverId;
            }
        }
        if (status === 'delivered') {
            updateData.endTime = now;
            updateData.actualDeliveryTime = now;
            // Ensure driver ID is set for completion
            if (driverId) {
                updateData.driverId = driverId;
            }
            else if (!delivery.driverId) {
                throw new Error('Driver ID is required to complete delivery');
            }
        }
        if (status === 'assigned' && driverId) {
            updateData.driverId = driverId;
        }
        const updatedDelivery = await this.deliveryRepository.update(deliveryId, updateData);
        if (updatedDelivery) {
            // Publish delivery updated event for other services
            await this.messagePublisher.publish('delivery.updated', {
                id: updatedDelivery.id,
                packageId: updatedDelivery.packageId,
                status: updatedDelivery.status,
                driverId: updatedDelivery.driverId,
                completedAt: status === 'delivered' ? updatedDelivery.actualDeliveryTime : null,
                startedAt: status === 'in transit' ? updatedDelivery.startTime : null
            });
        }
        return updatedDelivery;
    }
}
exports.UpdateDeliveryStatusUseCase = UpdateDeliveryStatusUseCase;
