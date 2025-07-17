import { IRoleRepository } from '../../repositories/IRoleRepository';
import { Role } from '../../entities/Role';

export class GetAllRolesUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }
}