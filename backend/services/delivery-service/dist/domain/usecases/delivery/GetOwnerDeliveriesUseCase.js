"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOwnerDeliveriesUseCase = void 0;
class GetOwnerDeliveriesUseCase {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute(ownerId) {
        return this.deliveryRepository.findByOwnerId(ownerId);
    }
}
exports.GetOwnerDeliveriesUseCase = GetOwnerDeliveriesUseCase;
