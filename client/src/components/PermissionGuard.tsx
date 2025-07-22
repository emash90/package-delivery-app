
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { Permission, UserRole } from '@/types/permissions';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requireAll?: boolean; // If true, user must have ALL permissions/roles
  fallbackPath?: string;
  showToastOnDenied?: boolean;
  fallbackComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requiredRole,
  requiredRoles = [],
  requireAll = false,
  fallbackPath = '/',
  showToastOnDenied = true,
  fallbackComponent,
  loadingComponent
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, userRole, isLoading, currentUser } = useUserPermission();
  const { toast } = useToast();

  if (isLoading) {
    return loadingComponent || (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    if (showToastOnDenied) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this resource",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" replace />;
  }

  // Check if user is active
  if (currentUser.status !== 'active') {
    if (showToastOnDenied) {
      toast({
        title: "Account Suspended",
        description: "Your account is not active. Please contact support.",
        variant: "destructive",
      });
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Combine all permission checks
  const allPermissions = [
    ...(requiredPermission ? [requiredPermission] : []),
    ...requiredPermissions
  ];

  const allRoles = [
    ...(requiredRole ? [requiredRole] : []),
    ...requiredRoles
  ];

  let hasAccess = true;
  let deniedReason = '';

  // Check permissions
  if (allPermissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(allPermissions);
      deniedReason = hasAccess ? '' : `You need all of these permissions: ${allPermissions.join(', ')}`;
    } else {
      hasAccess = hasAnyPermission(allPermissions);
      deniedReason = hasAccess ? '' : `You need one of these permissions: ${allPermissions.join(', ')}`;
    }
  }

  // Check roles (only if permission check passed)
  if (hasAccess && allRoles.length > 0) {
    if (requireAll) {
      // For roles, "requireAll" doesn't make sense since a user can only have one role
      // So we treat it as "any role"
      hasAccess = allRoles.includes(userRole!);
      deniedReason = hasAccess ? '' : `You need one of these roles: ${allRoles.join(', ')}`;
    } else {
      hasAccess = allRoles.includes(userRole!);
      deniedReason = hasAccess ? '' : `You need one of these roles: ${allRoles.join(', ')}`;
    }
  }

  if (!hasAccess) {
    if (showToastOnDenied) {
      toast({
        title: "Access Denied",
        description: deniedReason,
        variant: "destructive",
      });
    }
    
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return <Navigate to={fallbackPath} replace />;
  }

  return <PageTransition>{children}</PageTransition>;
};

export default PermissionGuard;
