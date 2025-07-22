import { useSelector } from 'react-redux';
import { Permission, UserRole } from '../types/permissions';
import { selectUser, selectUserPermissions, selectUserRole } from '../store/slices/authSlice';

/**
 * Hook to check if the current user has a specific permission
 */
export const usePermission = (permission: Permission): boolean => {
  const userPermissions = useSelector(selectUserPermissions);
  return userPermissions.includes(permission);
};

/**
 * Hook to check if the current user has any of the specified permissions
 */
export const usePermissions = (permissions: Permission[]): boolean => {
  const userPermissions = useSelector(selectUserPermissions);
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Hook to check if the current user has all of the specified permissions
 */
export const useAllPermissions = (permissions: Permission[]): boolean => {
  const userPermissions = useSelector(selectUserPermissions);
  return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Hook to check if the current user has a specific role
 */
export const useRole = (role: UserRole): boolean => {
  const userRole = useSelector(selectUserRole);
  return userRole === role;
};

/**
 * Hook to check if the current user has any of the specified roles
 */
export const useRoles = (roles: UserRole[]): boolean => {
  const userRole = useSelector(selectUserRole);
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Hook to get the current user's permissions
 */
export const useUserPermissions = (): Permission[] => {
  return useSelector(selectUserPermissions);
};

/**
 * Hook to get the current user's role
 */
export const useUserRole = (): UserRole | undefined => {
  return useSelector(selectUserRole);
};

/**
 * Hook to get the current user
 */
export const useCurrentUser = () => {
  return useSelector(selectUser);
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = (): boolean => {
  return useRole('admin');
};

/**
 * Hook to check if user is owner
 */
export const useIsOwner = (): boolean => {
  return useRole('owner');
};

/**
 * Hook to check if user is driver
 */
export const useIsDriver = (): boolean => {
  return useRole('driver');
};

/**
 * Utility hook for common permission checks
 */
export const usePermissionUtils = () => {
  const userPermissions = useSelector(selectUserPermissions);
  const userRole = useSelector(selectUserRole);
  
  return {
    hasPermission: (permission: Permission) => userPermissions.includes(permission),
    hasAnyPermission: (permissions: Permission[]) => permissions.some(p => userPermissions.includes(p)),
    hasAllPermissions: (permissions: Permission[]) => permissions.every(p => userPermissions.includes(p)),
    hasRole: (role: UserRole) => userRole === role,
    hasAnyRole: (roles: UserRole[]) => userRole ? roles.includes(userRole) : false,
    isAdmin: userRole === 'admin',
    isOwner: userRole === 'owner',
    isDriver: userRole === 'driver',
    permissions: userPermissions,
    role: userRole,
  };
};