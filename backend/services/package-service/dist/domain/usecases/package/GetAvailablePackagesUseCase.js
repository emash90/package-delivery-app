"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailablePackagesUseCase = void 0;
class GetAvailablePackagesUseCase {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute() {
        return this.packageRepository.findByStatus('processing');
    }
}
exports.GetAvailablePackagesUseCase = GetAvailablePackagesUseCase;
