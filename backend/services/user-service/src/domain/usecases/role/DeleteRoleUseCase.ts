import { IRoleRepository } from '../../repositories/IRoleRepository';
import { IUserRepository } from '../../repositories/IUserRepository';

export class DeleteRoleUseCase {
  constructor(
    private roleRepository: IRoleRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Check if any users are assigned to this role
    const usersWithRole = await this.userRepository.findByRoleId(id);
    if (usersWithRole.length > 0) {
      throw new Error('Cannot delete role: users are assigned to this role');
    }

    return await this.roleRepository.delete(id);
  }
}