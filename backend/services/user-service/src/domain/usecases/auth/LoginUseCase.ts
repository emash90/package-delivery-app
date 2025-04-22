
import { User, UserResponse } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IPasswordService } from '../../../application/services/IPasswordService';
import { ITokenService } from '../../../application/services/ITokenService';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.passwordService.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    const token = this.tokenService.generateToken({
      id: user.id!,
      email: user.email,
      role: user.role
    });

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    };
  }
}
