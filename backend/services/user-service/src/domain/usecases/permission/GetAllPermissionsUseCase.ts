import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { Permission } from '../../entities/Permission';

export class GetAllPermissionsUseCase {
  constructor(private permissionRepository: IPermissionRepository) {}

  async execute(): Promise<Permission[]> {
    return await this.permissionRepository.findAll();
  }
}