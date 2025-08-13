"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPermissionsUseCase = void 0;
class GetAllPermissionsUseCase {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async execute() {
        return await this.permissionRepository.findAll();
    }
}
exports.GetAllPermissionsUseCase = GetAllPermissionsUseCase;
