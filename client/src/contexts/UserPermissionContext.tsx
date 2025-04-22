
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission, ROLES, User } from '@/types/permissions';

type UserPermissionContextType = {
  currentUser: User | null;
  hasPermission: (permission: Permission) => boolean;
  userRole: string | null;
  isLoading: boolean;
};

const UserPermissionContext = createContext<UserPermissionContextType>({
  currentUser: null,
  hasPermission: () => false,
  userRole: null,
  isLoading: true,
});

export const useUserPermission = () => useContext(UserPermissionContext);

export const UserPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would fetch the current user from your auth system
  useEffect(() => {
    // Simulate fetching user data
    const fetchCurrentUser = async () => {
      // This would be a real API call in production
      // For now we'll just simulate a logged-in super admin
      setTimeout(() => {
        setCurrentUser({
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'super_admin',
          department: 'Administration',
          createdAt: new Date().toISOString(),
          status: 'active'
        });
        setIsLoading(false);
      }, 500);
    };

    fetchCurrentUser();
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    
    const userRole = ROLES[currentUser.role];
    if (!userRole) return false;
    
    return userRole.permissions.includes(permission);
  };

  return (
    <UserPermissionContext.Provider
      value={{
        currentUser,
        hasPermission,
        userRole: currentUser?.role || null,
        isLoading,
      }}
    >
      {children}
    </UserPermissionContext.Provider>
  );
};
