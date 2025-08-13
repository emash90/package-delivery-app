"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPendingDeliveriesUseCase = void 0;
class GetPendingDeliveriesUseCase {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute() {
        return this.deliveryRepository.findPending();
    }
}
exports.GetPendingDeliveriesUseCase = GetPendingDeliveriesUseCase;
