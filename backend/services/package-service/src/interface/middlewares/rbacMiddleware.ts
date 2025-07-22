import { Request, Response, NextFunction } from 'express';
import { Permission } from '../../shared/constants/permissions';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions?: string[];
      };
    }
  }
}

export const requirePermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has the required permission
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        message: `Access denied. Required permission: ${requiredPermission}. User has: ${userPermissions.join(', ')}` 
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

export const requireAnyPermission = (requiredPermissions: Permission[]) => {
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

export const checkPackageOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Admin can access any package
  if (req.user.role === 'admin') {
    return next();
  }

  // Add logic to check if user owns the package
  // This will be implemented in the controller level
  next();
};