
import bcrypt from 'bcryptjs';
import { IPasswordService } from '../../application/services/IPasswordService';

export class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
