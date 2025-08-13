"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const permissions_1 = require("../../../shared/constants/permissions");
class LoginUseCase {
    constructor(userRepository, roleRepository, permissionRepository, passwordService, tokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        if (user.status !== 'active') {
            throw new Error('Account is not active');
        }
        const isPasswordValid = await this.passwordService.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        // Get user permissions
        let userPermissions = [];
        // Get permissions from role
        if (user.roleId) {
            const role = await this.roleRepository.findById(user.roleId);
            if (role && role.isActive) {
                const rolePermissions = await this.permissionRepository.findByIds(role.permissions);
                userPermissions = [...userPermissions, ...rolePermissions.map(p => p.name)];
            }
        }
        // Get direct permissions
        if (user.permissions && user.permissions.length > 0) {
            const directPermissions = await this.permissionRepository.findByIds(user.permissions);
            userPermissions = [...userPermissions, ...directPermissions.map(p => p.name)];
        }
        // Fallback to default permissions if no specific permissions found
        if (userPermissions.length === 0) {
            const defaultPerms = permissions_1.DEFAULT_PERMISSIONS[user.role];
            userPermissions = defaultPerms ? [...defaultPerms] : [];
        }
        // Remove duplicates
        userPermissions = [...new Set(userPermissions)];
        // Update last login
        await this.userRepository.updateLastLogin(user.id);
        const token = this.tokenService.generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            permissions: userPermissions
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            roleId: user.roleId,
            permissions: userPermissions,
            status: user.status,
            lastLogin: user.lastLogin,
            token
        };
    }
}
exports.LoginUseCase = LoginUseCase;
