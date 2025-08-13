"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleUseCase = void 0;
class CreateRoleUseCase {
    constructor(roleRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async execute(roleData) {
        // Check if role already exists
        const existingRole = await this.roleRepository.findByName(roleData.name);
        if (existingRole) {
            throw new Error('Role with this name already exists');
        }
        // Validate permissions exist
        const permissions = await this.permissionRepository.findByIds(roleData.permissions);
        if (permissions.length !== roleData.permissions.length) {
            throw new Error('One or more permissions do not exist');
        }
        const role = {
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.permissions,
            isActive: true
        };
        return await this.roleRepository.create(role);
    }
}
exports.CreateRoleUseCase = CreateRoleUseCase;
