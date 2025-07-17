import { IRoleRepository } from '../../repositories/IRoleRepository';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { Role } from '../../entities/Role';

export class UpdateRoleUseCase {
  constructor(
    private roleRepository: IRoleRepository,
    private permissionRepository: IPermissionRepository
  ) {}

  async execute(id: string, updateData: {
    name?: string;
    description?: string;
    permissions?: string[];
    isActive?: boolean;
  }): Promise<Role | null> {
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