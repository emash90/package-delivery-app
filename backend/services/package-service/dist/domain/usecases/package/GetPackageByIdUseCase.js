"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPackageByIdUseCase = void 0;
class GetPackageByIdUseCase {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
    }
    async execute(id) {
        return this.packageRepository.findById(id);
    }
}
exports.GetPackageByIdUseCase = GetPackageByIdUseCase;
