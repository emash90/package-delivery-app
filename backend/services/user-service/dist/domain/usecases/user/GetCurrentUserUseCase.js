"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentUserUseCase = void 0;
class GetCurrentUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            roleId: user.roleId,
            permissions: user.permissions,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
exports.GetCurrentUserUseCase = GetCurrentUserUseCase;
