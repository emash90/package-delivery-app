import React from 'react';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { Permission, UserRole } from '@/types/permissions';

interface ConditionalRenderProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requireAll?: boolean;
  fallbackComponent?: React.ReactNode;
  requireAuth?: boolean;
  requireActiveUser?: boolean;
}

const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requiredRole,
  requiredRoles = [],
  requireAll = false,
  fallbackComponent,
  requireAuth = true,
  requireActiveUser = true,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, userRole, currentUser } = useUserPermission();

  // Check authentication
  if (requireAuth && !currentUser) {
    return fallbackComponent || null;
  }

  // Check if user is active
  if (requireActiveUser && currentUser && currentUser.status !== 'active') {
    return fallbackComponent || null;
  }

  // If no specific permissions or roles required, just render children
  if (!requiredPermission && requiredPermissions.length === 0 && !requiredRole && requiredRoles.length === 0) {
    return <>{children}</>;
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

  // Check permissions
  if (allPermissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(allPermissions);
    } else {
      hasAccess = hasAnyPermission(allPermissions);
    }
  }

  // Check roles (only if permission check passed)
  if (hasAccess && allRoles.length > 0) {
    hasAccess = allRoles.includes(userRole!);
  }

  if (!hasAccess) {
    return fallbackComponent || null;
  }

  return <>{children}</>;
};

export default ConditionalRender;