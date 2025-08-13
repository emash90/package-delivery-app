"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackPackageUseCase = void 0;
class TrackPackageUseCase {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute(trackingId) {
        return this.packageRepository.findByTrackingId(trackingId);
    }
}
exports.TrackPackageUseCase = TrackPackageUseCase;
