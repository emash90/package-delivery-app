
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
}
