"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPackagesByOwnerIdUseCase = void 0;
class GetPackagesByOwnerIdUseCase {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute(userId) {
        return this.packageRepository.findByOwnerId(userId);
    }
}
exports.GetPackagesByOwnerIdUseCase = GetPackagesByOwnerIdUseCase;
