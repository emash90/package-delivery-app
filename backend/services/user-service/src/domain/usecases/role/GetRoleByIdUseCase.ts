import { IRoleRepository } from '../../repositories/IRoleRepository';
import { Role } from '../../entities/Role';

export class GetRoleByIdUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(id: string): Promise<Role | null> {
    return await this.roleRepository.findById(id);
  }
}