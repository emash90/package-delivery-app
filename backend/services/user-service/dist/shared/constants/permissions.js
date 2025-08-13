"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PERMISSIONS = exports.ACTIONS = exports.RESOURCES = exports.PERMISSIONS = void 0;
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
exports.RESOURCES = {
    USER: 'user',
    PACKAGE: 'package',
    DELIVERY: 'delivery',
    ROLE: 'role',
    ADMIN: 'admin'
};
exports.ACTIONS = {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    MANAGE: 'manage',
    CLAIM: 'claim',
    COMPLETE: 'complete',
    TRACK: 'track',
    VIEW_ALL: 'view_all',
    ASSIGN: 'assign',
    ACCESS: 'access',
    MANAGE_USERS: 'manage_users',
    MANAGE_ROLES: 'manage_roles',
    VIEW_ANALYTICS: 'view_analytics',
    SYSTEM_CONFIG: 'system_config'
};
exports.DEFAULT_PERMISSIONS = {
    owner: [
        exports.PERMISSIONS.PACKAGES_READ,
        exports.PERMISSIONS.PACKAGES_CREATE,
        exports.PERMISSIONS.PACKAGES_UPDATE,
        exports.PERMISSIONS.PACKAGES_DELETE,
        exports.PERMISSIONS.PACKAGES_TRACK,
        exports.PERMISSIONS.DELIVERIES_READ,
        exports.PERMISSIONS.USERS_READ
    ],
    driver: [
        exports.PERMISSIONS.PACKAGES_READ,
        exports.PERMISSIONS.PACKAGES_TRACK,
        exports.PERMISSIONS.DELIVERIES_READ,
        exports.PERMISSIONS.DELIVERIES_CLAIM,
        exports.PERMISSIONS.DELIVERIES_UPDATE,
        exports.PERMISSIONS.DELIVERIES_COMPLETE,
        exports.PERMISSIONS.USERS_READ
    ],
    admin: [
        exports.PERMISSIONS.ADMIN_ACCESS,
        exports.PERMISSIONS.ADMIN_MANAGE_USERS,
        exports.PERMISSIONS.ADMIN_MANAGE_ROLES,
        exports.PERMISSIONS.ADMIN_VIEW_ANALYTICS,
        exports.PERMISSIONS.ADMIN_SYSTEM_CONFIG,
        exports.PERMISSIONS.USERS_READ,
        exports.PERMISSIONS.USERS_CREATE,
        exports.PERMISSIONS.USERS_UPDATE,
        exports.PERMISSIONS.USERS_DELETE,
        exports.PERMISSIONS.USERS_MANAGE_ROLES,
        exports.PERMISSIONS.PACKAGES_READ,
        exports.PERMISSIONS.PACKAGES_CREATE,
        exports.PERMISSIONS.PACKAGES_UPDATE,
        exports.PERMISSIONS.PACKAGES_DELETE,
        exports.PERMISSIONS.PACKAGES_TRACK,
        exports.PERMISSIONS.PACKAGES_VIEW_ALL,
        exports.PERMISSIONS.DELIVERIES_READ,
        exports.PERMISSIONS.DELIVERIES_CLAIM,
        exports.PERMISSIONS.DELIVERIES_UPDATE,
        exports.PERMISSIONS.DELIVERIES_COMPLETE,
        exports.PERMISSIONS.DELIVERIES_VIEW_ALL,
        exports.PERMISSIONS.DELIVERIES_ASSIGN,
        exports.PERMISSIONS.ROLES_READ,
        exports.PERMISSIONS.ROLES_CREATE,
        exports.PERMISSIONS.ROLES_UPDATE,
        exports.PERMISSIONS.ROLES_DELETE
    ]
};
