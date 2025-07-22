import { Permission, UserRole, User, DEFAULT_PERMISSIONS } from '../types/permissions';

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  
  const permissions = user.permissions || DEFAULT_PERMISSIONS[user.role];
  return permissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  
  const userPermissions = user.permissions || DEFAULT_PERMISSIONS[user.role];
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if a user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  
  const userPermissions = user.permissions || DEFAULT_PERMISSIONS[user.role];
  return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

/**
 * Check if a user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Check if a user is an owner
 */
export const isOwner = (user: User | null): boolean => {
  return hasRole(user, 'owner');
};

/**
 * Check if a user is a driver
 */
export const isDriver = (user: User | null): boolean => {
  return hasRole(user, 'driver');
};

/**
 * Get user permissions with fallback to default permissions
 */
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user) return [];
  return user.permissions || DEFAULT_PERMISSIONS[user.role];
};

/**
 * Check if user can access a resource based on role hierarchy
 */
export const canAccessResource = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'driver': 1,
    'owner': 2,
    'admin': 3,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * Check if user can manage another user (admin can manage all, others can't manage)
 */
export const canManageUser = (currentUser: User | null, targetUser: User | null): boolean => {
  if (!currentUser || !targetUser) return false;
  
  // Admin can manage all users
  if (currentUser.role === 'admin') return true;
  
  // Users can only manage themselves
  return currentUser.id === targetUser.id;
};

/**
 * Check if user can access package (owners can access their own, admin can access all)
 */
export const canAccessPackage = (user: User | null, packageOwnerId: string): boolean => {
  if (!user) return false;
  
  // Admin can access all packages
  if (user.role === 'admin') return true;
  
  // Users can access their own packages
  return user.id === packageOwnerId;
};

/**
 * Check if user can access delivery (drivers can access assigned deliveries, owners can access their package deliveries, admin can access all)
 */
export const canAccessDelivery = (user: User | null, delivery: { driverId?: string; packageOwnerId?: string }): boolean => {
  if (!user) return false;
  
  // Admin can access all deliveries
  if (user.role === 'admin') return true;
  
  // Driver can access assigned deliveries
  if (user.role === 'driver' && delivery.driverId === user.id) return true;
  
  // Owner can access deliveries for their packages
  if (user.role === 'owner' && delivery.packageOwnerId === user.id) return true;
  
  return false;
};

/**
 * Get permission description for UI display
 */
export const getPermissionDescription = (permission: Permission): string => {
  const descriptions: Record<Permission, string> = {
    'users.read': 'View user information',
    'users.create': 'Create new users',
    'users.update': 'Update user information',
    'users.delete': 'Delete users',
    'users.manage_roles': 'Manage user roles',
    'packages.read': 'View package information',
    'packages.create': 'Create new packages',
    'packages.update': 'Update package information',
    'packages.delete': 'Delete packages',
    'packages.track': 'Track package status',
    'packages.view_all': 'View all packages',
    'deliveries.read': 'View delivery information',
    'deliveries.claim': 'Claim delivery jobs',
    'deliveries.update': 'Update delivery status',
    'deliveries.complete': 'Complete deliveries',
    'deliveries.view_all': 'View all deliveries',
    'deliveries.assign': 'Assign deliveries to drivers',
    'admin.access': 'Access admin panel',
    'admin.manage_users': 'Manage all users',
    'admin.manage_roles': 'Manage roles and permissions',
    'admin.view_analytics': 'View system analytics',
    'admin.system_config': 'Configure system settings',
    'roles.read': 'View role information',
    'roles.create': 'Create new roles',
    'roles.update': 'Update role information',
    'roles.delete': 'Delete roles',
  };
  
  return descriptions[permission] || permission;
};

/**
 * Get role description for UI display
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    'owner': 'Package owners who can create and manage their packages',
    'driver': 'Delivery drivers who can claim and complete deliveries',
    'admin': 'System administrators with full access',
  };
  
  return descriptions[role] || role;
};

/**
 * Check if user status allows access
 */
export const isUserActive = (user: User | null): boolean => {
  if (!user) return false;
  return user.status === 'active';
};

/**
 * Comprehensive permission check that includes user status
 */
export const canPerformAction = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  if (!isUserActive(user)) return false;
  return hasPermission(user, permission);
};