"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_PERMISSIONS = exports.PERMISSIONS = void 0;
exports.PERMISSIONS = {
    // User permissions
    USERS_READ: 'users.read',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    USERS_MANAGE_ROLES: 'users.manage_roles',
    // Package permissions
    PACKAGES_READ: 'packages.read',
    PACKAGES_CREATE: 'packages.create',
    PACKAGES_UPDATE: 'packages.update',
    PACKAGES_DELETE: 'packages.delete',
    PACKAGES_TRACK: 'packages.track',
    PACKAGES_VIEW_ALL: 'packages.view_all',
    // Delivery permissions
    DELIVERIES_READ: 'deliveries.read',
    DELIVERIES_CLAIM: 'deliveries.claim',
    DELIVERIES_UPDATE: 'deliveries.update',
    DELIVERIES_COMPLETE: 'deliveries.complete',
    DELIVERIES_VIEW_ALL: 'deliveries.view_all',
    DELIVERIES_ASSIGN: 'deliveries.assign',
    // Admin permissions
    ADMIN_ACCESS: 'admin.access',
    ADMIN_MANAGE_USERS: 'admin.manage_users',
    ADMIN_MANAGE_ROLES: 'admin.manage_roles',
    ADMIN_VIEW_ANALYTICS: 'admin.view_analytics',
    ADMIN_SYSTEM_CONFIG: 'admin.system_config',
    // Role permissions
    ROLES_READ: 'roles.read',
    ROLES_CREATE: 'roles.create',
    ROLES_UPDATE: 'roles.update',
    ROLES_DELETE: 'roles.delete',
};
// Route-based permission mapping
exports.ROUTE_PERMISSIONS = {
    // User routes
    'GET /api/users': [exports.PERMISSIONS.USERS_READ],
    'POST /api/users': [exports.PERMISSIONS.USERS_CREATE],
    'PUT /api/users/:id': [exports.PERMISSIONS.USERS_UPDATE],
    'DELETE /api/users/:id': [exports.PERMISSIONS.USERS_DELETE],
    'GET /api/users/roles': [exports.PERMISSIONS.ROLES_READ],
    'POST /api/users/roles': [exports.PERMISSIONS.ROLES_CREATE],
    'PUT /api/users/roles/:id': [exports.PERMISSIONS.ROLES_UPDATE],
    'DELETE /api/users/roles/:id': [exports.PERMISSIONS.ROLES_DELETE],
    // Package routes
    'GET /api/packages': [exports.PERMISSIONS.PACKAGES_READ],
    'POST /api/packages': [exports.PERMISSIONS.PACKAGES_CREATE],
    'PUT /api/packages/:id': [exports.PERMISSIONS.PACKAGES_UPDATE],
    'DELETE /api/packages/:id': [exports.PERMISSIONS.PACKAGES_DELETE],
    'GET /api/packages/available': [exports.PERMISSIONS.PACKAGES_READ],
    'GET /api/packages/user/:userId': [exports.PERMISSIONS.PACKAGES_READ],
    // Delivery routes
    'GET /api/deliveries': [exports.PERMISSIONS.DELIVERIES_READ],
    'GET /api/deliveries/driver': [exports.PERMISSIONS.DELIVERIES_READ],
    'POST /api/deliveries/:id/start': [exports.PERMISSIONS.DELIVERIES_CLAIM],
    'POST /api/deliveries/:id/complete': [exports.PERMISSIONS.DELIVERIES_COMPLETE],
    'POST /api/deliveries/:id/issue': [exports.PERMISSIONS.DELIVERIES_UPDATE],
    'GET /api/deliveries/owner': [exports.PERMISSIONS.DELIVERIES_READ],
};
