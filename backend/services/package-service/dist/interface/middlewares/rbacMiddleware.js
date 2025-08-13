"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPackageOwnership = exports.requireAnyPermission = exports.requireRole = exports.requirePermission = void 0;
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
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
exports.requirePermission = requirePermission;
const requireRole = (requiredRole) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
const requireAnyPermission = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userPermissions = req.user.permissions || [];
        // Check if user has any of the required permissions
        const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({
                message: `Access denied. Required one of: ${requiredPermissions.join(', ')}`
            });
        }
        next();
    };
};
exports.requireAnyPermission = requireAnyPermission;
const checkPackageOwnership = (req, res, next) => {
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
exports.checkPackageOwnership = checkPackageOwnership;
