
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../../infrastructure/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'packaroo_delivery_service_secret';
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
