"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyPermission = exports.requireRole = exports.requirePermission = exports.enrichUserWithPermissions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enrichUserWithPermissions = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        const token = authHeader.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'packaroo_gateway_secret');
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
    }
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.enrichUserWithPermissions = enrichUserWithPermissions;
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
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
