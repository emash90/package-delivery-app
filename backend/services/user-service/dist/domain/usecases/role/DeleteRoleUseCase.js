"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRoleUseCase = void 0;
class DeleteRoleUseCase {
    constructor(roleRepository, userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }
    async execute(id) {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new Error('Role not found');
        }
        // Check if any users are assigned to this role
        const usersWithRole = await this.userRepository.findByRoleId(id);
        if (usersWithRole.length > 0) {
            throw new Error('Cannot delete role: users are assigned to this role');
        }
        return await this.roleRepository.delete(id);
    }
}
exports.DeleteRoleUseCase = DeleteRoleUseCase;
