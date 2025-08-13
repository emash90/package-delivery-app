
import { User, UserResponse } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IRoleRepository } from '../../repositories/IRoleRepository';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { IPasswordService } from '../../../application/services/IPasswordService';
import { ITokenService } from '../../../application/services/ITokenService';
import { IMessagePublisher } from '../../../application/services/IMessagePublisher';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService,
    private messagePublisher: IMessagePublisher
  ) {}

  async execute(userData: User): Promise<UserResponse | null> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      return null;
    }

    // Find the role based on the user's role string
    const roleMap = {
      'owner': 'Owner',
      'driver': 'Driver', 
      'admin': 'Admin'
    };
    
    const roleName = roleMap[userData.role as keyof typeof roleMap];
    const role = await this.roleRepository.findByName(roleName);
    
    if (!role) {
      throw new Error(`Role ${roleName} not found. Please run database seeding.`);
    }

    const hashedPassword = await this.passwordService.hash(userData.password);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roleId: role.id,
      permissions: role.permissions
    });

    // Publish user created event
    await this.messagePublisher.publish('user.created', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Get permission names for JWT token
    const permissionNames: string[] = [];
    if (user.permissions && user.permissions.length > 0) {
      for (const permissionId of user.permissions) {
        const permission = await this.permissionRepository.findById(permissionId.toString());
        if (permission) {
          permissionNames.push(permission.name);
        }
      }
    }

    const token = this.tokenService.generateToken({
      id: user.id!,
      email: user.email,
      role: user.role,
      permissions: permissionNames
    });

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      roleId: user.roleId,
      permissions: permissionNames,
      status: user.status,
      token
    };
  }
}
