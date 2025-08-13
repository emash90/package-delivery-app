"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPackagesUseCase = void 0;
class GetAllPackagesUseCase {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute() {
        return this.packageRepository.findAll();
    }
}
exports.GetAllPackagesUseCase = GetAllPackagesUseCase;
