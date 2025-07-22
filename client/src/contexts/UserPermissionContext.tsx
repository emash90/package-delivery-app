
import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Permission, User, UserRole } from '@/types/permissions';
import { selectUser, selectUserPermissions, selectUserRole, selectAuthLoading } from '@/store/slices/authSlice';

type UserPermissionContextType = {
  currentUser: User | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  userRole: UserRole | null;
  permissions: Permission[];
  isLoading: boolean;
};

const UserPermissionContext = createContext<UserPermissionContextType>({
  currentUser: null,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  hasRole: () => false,
  userRole: null,
  permissions: [],
  isLoading: true,
});

export const useUserPermission = () => useContext(UserPermissionContext);

export const UserPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useSelector(selectUser);
  const permissions = useSelector(selectUserPermissions);
  const userRole = useSelector(selectUserRole);
  const isLoading = useSelector(selectAuthLoading);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  return (
    <UserPermissionContext.Provider
      value={{
        currentUser,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        userRole: userRole || null,
        permissions,
        isLoading,
      }}
    >
      {children}
    </UserPermissionContext.Provider>
  );
};
