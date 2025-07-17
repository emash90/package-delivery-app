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

// Route-based permission mapping
export const ROUTE_PERMISSIONS = {
  // User routes
  'GET /api/users': [PERMISSIONS.USERS_READ],
  'POST /api/users': [PERMISSIONS.USERS_CREATE],
  'PUT /api/users/:id': [PERMISSIONS.USERS_UPDATE],
  'DELETE /api/users/:id': [PERMISSIONS.USERS_DELETE],
  'GET /api/users/roles': [PERMISSIONS.ROLES_READ],
  'POST /api/users/roles': [PERMISSIONS.ROLES_CREATE],
  'PUT /api/users/roles/:id': [PERMISSIONS.ROLES_UPDATE],
  'DELETE /api/users/roles/:id': [PERMISSIONS.ROLES_DELETE],
  
  // Package routes
  'GET /api/packages': [PERMISSIONS.PACKAGES_READ],
  'POST /api/packages': [PERMISSIONS.PACKAGES_CREATE],
  'PUT /api/packages/:id': [PERMISSIONS.PACKAGES_UPDATE],
  'DELETE /api/packages/:id': [PERMISSIONS.PACKAGES_DELETE],
  'GET /api/packages/available': [PERMISSIONS.PACKAGES_READ],
  'GET /api/packages/user/:userId': [PERMISSIONS.PACKAGES_READ],
  
  // Delivery routes
  'GET /api/deliveries': [PERMISSIONS.DELIVERIES_READ],
  'GET /api/deliveries/driver': [PERMISSIONS.DELIVERIES_READ],
  'POST /api/deliveries/:id/start': [PERMISSIONS.DELIVERIES_CLAIM],
  'POST /api/deliveries/:id/complete': [PERMISSIONS.DELIVERIES_COMPLETE],
  'POST /api/deliveries/:id/issue': [PERMISSIONS.DELIVERIES_UPDATE],
  'GET /api/deliveries/owner': [PERMISSIONS.DELIVERIES_READ],
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];