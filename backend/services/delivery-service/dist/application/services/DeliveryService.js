"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const GetDriverDeliveriesUseCase_1 = require("../../domain/usecases/delivery/GetDriverDeliveriesUseCase");
const GetOwnerDeliveriesUseCase_1 = require("../../domain/usecases/delivery/GetOwnerDeliveriesUseCase");
const UpdateDeliveryStatusUseCase_1 = require("../../domain/usecases/delivery/UpdateDeliveryStatusUseCase");
const GetPendingDeliveriesUseCase_1 = require("../../domain/usecases/delivery/GetPendingDeliveriesUseCase");
class DeliveryService {
    constructor(deliveryRepository, messagePublisher) {
        this.deliveryRepository = deliveryRepository;
        this.messagePublisher = messagePublisher;
        this.getDriverDeliveriesUseCase = new GetDriverDeliveriesUseCase_1.GetDriverDeliveriesUseCase(deliveryRepository);
        this.getOwnerDeliveriesUseCase = new GetOwnerDeliveriesUseCase_1.GetOwnerDeliveriesUseCase(deliveryRepository);
        this.updateDeliveryStatusUseCase = new UpdateDeliveryStatusUseCase_1.UpdateDeliveryStatusUseCase(deliveryRepository, messagePublisher);
        this.getPendingDeliveriesUseCase = new GetPendingDeliveriesUseCase_1.GetPendingDeliveriesUseCase(deliveryRepository);
    }
    async getDriverDeliveries(driverId) {
        return this.getDriverDeliveriesUseCase.execute(driverId);
    }
    async getDriverCompletedDeliveries(driverId) {
        const allDriverDeliveries = await this.getDriverDeliveriesUseCase.execute(driverId);
        return allDriverDeliveries.filter(delivery => delivery.status === 'delivered');
    }
    async getOwnerDeliveries(ownerId) {
        return this.getOwnerDeliveriesUseCase.execute(ownerId);
    }
    async getDeliveryById(deliveryId) {
        return this.deliveryRepository.findById(deliveryId);
    }
    async getDeliveryByPackageId(packageId) {
        return this.deliveryRepository.findByPackageId(packageId);
    }
    async getPendingDeliveries() {
        return this.getPendingDeliveriesUseCase.execute();
    }
    async startDelivery(deliveryId, driverId) {
        return this.updateDeliveryStatusUseCase.execute(deliveryId, 'in transit', driverId);
    }
    async completeDelivery(deliveryId, driverId) {
        return this.updateDeliveryStatusUseCase.execute(deliveryId, 'delivered', driverId);
    }
    async reportIssue(deliveryId, issue) {
        const delivery = await this.deliveryRepository.findById(deliveryId);
        if (!delivery) {
            return null;
        }
        return this.deliveryRepository.update(deliveryId, {
            status: 'failed',
            issue
        });
    }
}
exports.DeliveryService = DeliveryService;
