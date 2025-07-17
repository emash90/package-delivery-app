import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { Permission } from '../../entities/Permission';

export class CreatePermissionUseCase {
  constructor(private permissionRepository: IPermissionRepository) {}

  async execute(permissionData: {
    name: string;
    description: string;
    resource: string;
    action: string;
  }): Promise<Permission> {
    // Check if permission already exists
    const existingPermission = await this.permissionRepository.findByName(permissionData.name);
    if (existingPermission) {
      throw new Error('Permission with this name already exists');
    }

    const permission: Permission = {
      name: permissionData.name,
      description: permissionData.description,
      resource: permissionData.resource,
      action: permissionData.action
    };

    return await this.permissionRepository.create(permission);
  }
}