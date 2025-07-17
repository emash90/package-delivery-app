import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      permissions?: string[];
    };
  }
}

export const enrichUserWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'packaroo_gateway_secret') as any;
    
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || []
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has the required permission
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        message: `Access denied. Required permission: ${requiredPermission}` 
      });
    }

    next();
  };
};

export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${requiredRole}` 
      });
    }

    next();
  };
};

export const requireAnyPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        message: `Access denied. Required one of: ${requiredPermissions.join(', ')}` 
      });
    }

    next();
  };
};