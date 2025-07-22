// Permission types that match the backend implementation
export type Permission = 
  // User permissions
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'users.manage_roles'
  
  // Package permissions
  | 'packages.read'
  | 'packages.create'
  | 'packages.update'
  | 'packages.delete'
  | 'packages.track'
  | 'packages.view_all'
  
  // Delivery permissions
  | 'deliveries.read'
  | 'deliveries.claim'
  | 'deliveries.update'
  | 'deliveries.complete'
  | 'deliveries.view_all'
  | 'deliveries.assign'
  
  // Admin permissions
  | 'admin.access'
  | 'admin.manage_users'
  | 'admin.manage_roles'
  | 'admin.view_analytics'
  | 'admin.system_config'
  
  // Role permissions
  | 'roles.read'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete';

export const PERMISSIONS = {
  // User permissions
  USERS_READ: 'users.read' as const,
  USERS_CREATE: 'users.create' as const,
  USERS_UPDATE: 'users.update' as const,
  USERS_DELETE: 'users.delete' as const,
  USERS_MANAGE_ROLES: 'users.manage_roles' as const,
  
  // Package permissions
  PACKAGES_READ: 'packages.read' as const,
  PACKAGES_CREATE: 'packages.create' as const,
  PACKAGES_UPDATE: 'packages.update' as const,
  PACKAGES_DELETE: 'packages.delete' as const,
  PACKAGES_TRACK: 'packages.track' as const,
  PACKAGES_VIEW_ALL: 'packages.view_all' as const,
  
  // Delivery permissions
  DELIVERIES_READ: 'deliveries.read' as const,
  DELIVERIES_CLAIM: 'deliveries.claim' as const,
  DELIVERIES_UPDATE: 'deliveries.update' as const,
  DELIVERIES_COMPLETE: 'deliveries.complete' as const,
  DELIVERIES_VIEW_ALL: 'deliveries.view_all' as const,
  DELIVERIES_ASSIGN: 'deliveries.assign' as const,
  
  // Admin permissions
  ADMIN_ACCESS: 'admin.access' as const,
  ADMIN_MANAGE_USERS: 'admin.manage_users' as const,
  ADMIN_MANAGE_ROLES: 'admin.manage_roles' as const,
  ADMIN_VIEW_ANALYTICS: 'admin.view_analytics' as const,
  ADMIN_SYSTEM_CONFIG: 'admin.system_config' as const,
  
  // Role permissions
  ROLES_READ: 'roles.read' as const,
  ROLES_CREATE: 'roles.create' as const,
  ROLES_UPDATE: 'roles.update' as const,
  ROLES_DELETE: 'roles.delete' as const,
};

export type UserRole = 'owner' | 'driver' | 'admin';

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleId?: string;
  permissions?: Permission[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

// Permission descriptions for UI display
export const getPermissionDescription = (permission: Permission): string => {
  const descriptions: Record<Permission, string> = {
    // User permissions
    'users.read': 'View user information and profiles',
    'users.create': 'Create new user accounts',
    'users.update': 'Edit user information and settings',
    'users.delete': 'Delete user accounts',
    'users.manage_roles': 'Assign and manage user roles',
    
    // Package permissions
    'packages.read': 'View package information',
    'packages.create': 'Create new packages',
    'packages.update': 'Edit package details',
    'packages.delete': 'Delete packages',
    'packages.track': 'Track package delivery status',
    'packages.view_all': 'View all packages in the system',
    
    // Delivery permissions
    'deliveries.read': 'View delivery information',
    'deliveries.claim': 'Claim delivery assignments',
    'deliveries.update': 'Update delivery status',
    'deliveries.complete': 'Mark deliveries as completed',
    'deliveries.view_all': 'View all deliveries in the system',
    'deliveries.assign': 'Assign deliveries to drivers',
    
    // Admin permissions
    'admin.access': 'Access admin dashboard',
    'admin.manage_users': 'Manage user accounts and permissions',
    'admin.manage_roles': 'Create and manage user roles',
    'admin.view_analytics': 'View system analytics and reports',
    'admin.system_config': 'Configure system settings',
    
    // Role permissions
    'roles.read': 'View role information',
    'roles.create': 'Create new roles',
    'roles.update': 'Edit role permissions',
    'roles.delete': 'Delete roles'
  };
  
  return descriptions[permission] || 'Unknown permission';
};

// Default permissions for each role (matches backend)
export const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
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
};

// Predefined roles
export const ROLES: Record<string, Role> = {
  OWNER: {
    id: 'owner',
    name: 'Owner',
    description: 'Package owners who can create and manage their packages',
    permissions: DEFAULT_PERMISSIONS.owner,
    isActive: true
  },
  DRIVER: {
    id: 'driver',
    name: 'Driver',
    description: 'Delivery drivers who can claim and complete deliveries',
    permissions: DEFAULT_PERMISSIONS.driver,
    isActive: true
  },
  ADMIN: {
    id: 'admin',
    name: 'Admin',
    description: 'System administrators with full access',
    permissions: DEFAULT_PERMISSIONS.admin,
    isActive: true
  }
};
