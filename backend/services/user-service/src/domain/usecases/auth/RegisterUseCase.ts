
import { User, UserResponse } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IPasswordService } from '../../../application/services/IPasswordService';
import { ITokenService } from '../../../application/services/ITokenService';
import { IMessagePublisher } from '../../../application/services/IMessagePublisher';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private tokenService: ITokenService,
    private messagePublisher: IMessagePublisher
  ) {}

  async execute(userData: User): Promise<UserResponse | null> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      return null;
    }

    const hashedPassword = await this.passwordService.hash(userData.password);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Publish user created event
    await this.messagePublisher.publish('user.created', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

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
