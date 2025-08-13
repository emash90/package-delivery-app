"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleUseCase = void 0;
class UpdateRoleUseCase {
    constructor(roleRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async execute(id, updateData) {
        const existingRole = await this.roleRepository.findById(id);
        if (!existingRole) {
            throw new Error('Role not found');
        }
        // Check if new name already exists (if name is being updated)
        if (updateData.name && updateData.name !== existingRole.name) {
            const roleWithSameName = await this.roleRepository.findByName(updateData.name);
            if (roleWithSameName) {
                throw new Error('Role with this name already exists');
            }
        }
        // Validate permissions exist (if permissions are being updated)
        if (updateData.permissions) {
            const permissions = await this.permissionRepository.findByIds(updateData.permissions);
            if (permissions.length !== updateData.permissions.length) {
                throw new Error('One or more permissions do not exist');
            }
        }
        return await this.roleRepository.update(id, updateData);
    }
}
exports.UpdateRoleUseCase = UpdateRoleUseCase;
