import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../infrastructure/models/UserModel';
import { RoleModel } from '../../infrastructure/models/RoleModel';
import { PermissionModel } from '../../infrastructure/models/PermissionModel';
import { Permission } from '../../shared/constants/permissions';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
  };
}

export const requirePermission = (requiredPermission: Permission) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await UserModel.findById(req.user.id)
        .populate('roleId')
        .populate('permissions');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ message: 'User account is inactive' });
      }

      let userPermissions: string[] = [];

      // Get permissions from role
      if (user.roleId) {
        const role = await RoleModel.findById(user.roleId).populate('permissions');
        if (role && role.isActive) {
          const rolePermissions = await PermissionModel.find({
            _id: { $in: role.permissions }
          });
          userPermissions = [...userPermissions, ...rolePermissions.map(p => p.name)];
        }
      }

      // Get direct permissions
      if (user.permissions && user.permissions.length > 0) {
        const directPermissions = await PermissionModel.find({
          _id: { $in: user.permissions }
        });
        userPermissions = [...userPermissions, ...directPermissions.map(p => p.name)];
      }

      // Remove duplicates
      userPermissions = [...new Set(userPermissions)];

      // Check if user has the required permission
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ 
          message: `Access denied. Required permission: ${requiredPermission}` 
        });
      }

      // Add permissions to request for use in controllers
      req.user.permissions = userPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await UserModel.findById(req.user.id)
        .populate('roleId')
        .populate('permissions');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ message: 'User account is inactive' });
      }

      let userPermissions: string[] = [];

      // Get permissions from role
      if (user.roleId) {
        const role = await RoleModel.findById(user.roleId).populate('permissions');
        if (role && role.isActive) {
          const rolePermissions = await PermissionModel.find({
            _id: { $in: role.permissions }
          });
          userPermissions = [...userPermissions, ...rolePermissions.map(p => p.name)];
        }
      }

      // Get direct permissions
      if (user.permissions && user.permissions.length > 0) {
        const directPermissions = await PermissionModel.find({
          _id: { $in: user.permissions }
        });
        userPermissions = [...userPermissions, ...directPermissions.map(p => p.name)];
      }

      // Remove duplicates
      userPermissions = [...new Set(userPermissions)];

      // Check if user has any of the required permissions
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Access denied. Required one of: ${requiredPermissions.join(', ')}` 
        });
      }

      // Add permissions to request for use in controllers
      req.user.permissions = userPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const checkResourceOwnership = (resourceIdParam: string = 'id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource or it's related to them
    if (resourceId === userId) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
  };
};