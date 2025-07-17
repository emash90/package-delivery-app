
import { UserResponse } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IRoleRepository } from '../../repositories/IRoleRepository';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { IPasswordService } from '../../../application/services/IPasswordService';
import { ITokenService } from '../../../application/services/ITokenService';
import { DEFAULT_PERMISSIONS } from '../../../shared/constants/permissions';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string): Promise<UserResponse | null> {
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
    let userPermissions: string[] = [];

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
      const defaultPerms = DEFAULT_PERMISSIONS[user.role as keyof typeof DEFAULT_PERMISSIONS];
      userPermissions = defaultPerms ? [...defaultPerms] : [];
    }

    // Remove duplicates
    userPermissions = [...new Set(userPermissions)];

    // Update last login
    await this.userRepository.updateLastLogin(user.id!);

    const token = this.tokenService.generateToken({
      id: user.id!,
      email: user.email,
      role: user.role,
      permissions: userPermissions
    });

    return {
      id: user.id!,
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
