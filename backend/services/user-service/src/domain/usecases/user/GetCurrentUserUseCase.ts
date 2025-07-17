
import { User, UserResponse } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';

export class GetCurrentUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,    };
  }
}
