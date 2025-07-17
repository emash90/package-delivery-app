export const PERMISSIONS = {
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
} as const;

export const RESOURCES = {
  USER: 'user',
  PACKAGE: 'package',
  DELIVERY: 'delivery',
  ROLE: 'role',
  ADMIN: 'admin'
} as const;

export const ACTIONS = {
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
} as const;

export const DEFAULT_PERMISSIONS = {
  owner: [
    PERMISSIONS.PACKAGES_READ,
    PERMISSIONS.PACKAGES_CREATE,
    PERMISSIONS.PACKAGES_UPDATE,
    PERMISSIONS.PACKAGES_DELETE,
    PERMISSIONS.PACKAGES_TRACK,
    PERMISSIONS.DELIVERIES_READ,
    PERMISSIONS.USERS_READ
  ],
  driver: [
    PERMISSIONS.PACKAGES_READ,
    PERMISSIONS.PACKAGES_TRACK,
    PERMISSIONS.DELIVERIES_READ,
    PERMISSIONS.DELIVERIES_CLAIM,
    PERMISSIONS.DELIVERIES_UPDATE,
    PERMISSIONS.DELIVERIES_COMPLETE,
    PERMISSIONS.USERS_READ
  ],
  admin: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.ADMIN_MANAGE_USERS,
    PERMISSIONS.ADMIN_MANAGE_ROLES,
    PERMISSIONS.ADMIN_VIEW_ANALYTICS,
    PERMISSIONS.ADMIN_SYSTEM_CONFIG,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_MANAGE_ROLES,
    PERMISSIONS.PACKAGES_READ,
    PERMISSIONS.PACKAGES_CREATE,
    PERMISSIONS.PACKAGES_UPDATE,
    PERMISSIONS.PACKAGES_DELETE,
    PERMISSIONS.PACKAGES_TRACK,
    PERMISSIONS.PACKAGES_VIEW_ALL,
    PERMISSIONS.DELIVERIES_READ,
    PERMISSIONS.DELIVERIES_CLAIM,
    PERMISSIONS.DELIVERIES_UPDATE,
    PERMISSIONS.DELIVERIES_COMPLETE,
    PERMISSIONS.DELIVERIES_VIEW_ALL,
    PERMISSIONS.DELIVERIES_ASSIGN,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_UPDATE,
    PERMISSIONS.ROLES_DELETE
  ]
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
export type Resource = typeof RESOURCES[keyof typeof RESOURCES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];