
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../infrastructure/services/TokenService';

const tokenService = new TokenService();

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
