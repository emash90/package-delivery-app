"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverDeliveriesUseCase = void 0;
class GetDriverDeliveriesUseCase {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    async execute(driverId) {
        return this.deliveryRepository.findByDriverId(driverId);
    }
}
exports.GetDriverDeliveriesUseCase = GetDriverDeliveriesUseCase;
