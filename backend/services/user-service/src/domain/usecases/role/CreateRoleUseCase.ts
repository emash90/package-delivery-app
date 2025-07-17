import { IRoleRepository } from '../../repositories/IRoleRepository';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { Role } from '../../entities/Role';

export class CreateRoleUseCase {
  constructor(
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository
  ) {}

  async execute(roleData: {
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role> {
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

    const role: Role = {
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      isActive: true
    };

    return await this.roleRepository.create(role);
  }
}