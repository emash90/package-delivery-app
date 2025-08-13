"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePermissionUseCase = void 0;
class CreatePermissionUseCase {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async execute(permissionData) {
        // Check if permission already exists
        const existingPermission = await this.permissionRepository.findByName(permissionData.name);
        if (existingPermission) {
            throw new Error('Permission with this name already exists');
        }
        const permission = {
            name: permissionData.name,
            description: permissionData.description,
            resource: permissionData.resource,
            action: permissionData.action
        };
        return await this.permissionRepository.create(permission);
    }
}
exports.CreatePermissionUseCase = CreatePermissionUseCase;
