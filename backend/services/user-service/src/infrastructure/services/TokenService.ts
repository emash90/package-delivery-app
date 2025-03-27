import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/services/ITokenService';

export class TokenService implements ITokenService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'packaroo_default_secret';
    this.JWT_EXPIRES_IN = '1d'; // Use '1d' instead of '24h'
  }

  generateToken(payload: TokenPayload): string {
    const signOptions: SignOptions = {
      expiresIn: 86400, // 24 hours in seconds
    };

    return jwt.sign(payload, this.JWT_SECRET as Secret, signOptions);
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET as Secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
