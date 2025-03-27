
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { Permission } from '@/types/permissions';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallbackPath?: string;
  showToastOnDenied?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/',
  showToastOnDenied = true
}) => {
  const { hasPermission, isLoading } = useUserPermission();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission(requiredPermission)) {
    if (showToastOnDenied) {
      toast({
        title: "Access Denied",
        description: `You don't have the required permission: ${requiredPermission}`,
        variant: "destructive",
      });
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <PageTransition>{children}</PageTransition>;
};

export default PermissionGuard;
