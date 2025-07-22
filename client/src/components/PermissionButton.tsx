
import React from 'react';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { Permission, UserRole } from '@/types/permissions';
import AnimatedButton from '@/components/AnimatedButton';
import { ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface PermissionButtonProps extends ButtonProps {
  permission?: Permission;
  permissions?: Permission[];
  role?: UserRole;
  roles?: UserRole[];
  requireAll?: boolean;
  hideIfNoPermission?: boolean;
  showToastOnDenied?: boolean;
  deniedMessage?: string;
  fallbackComponent?: React.ReactNode;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  hideIfNoPermission = true,
  showToastOnDenied = true,
  deniedMessage,
  fallbackComponent,
  onClick,
  children,
  ...props
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, userRole, currentUser } = useUserPermission();
  const { toast } = useToast();

  // Check if user is authenticated and active
  if (!currentUser || currentUser.status !== 'active') {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return null;
  }

  // Combine all permission checks
  const allPermissions = [
    ...(permission ? [permission] : []),
    ...permissions
  ];

  const allRoles = [
    ...(role ? [role] : []),
    ...roles
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
    hasAccess = allRoles.includes(userRole!);
    deniedReason = hasAccess ? '' : `You need one of these roles: ${allRoles.join(', ')}`;
  }

  if (!hasAccess && hideIfNoPermission) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasAccess) {
      if (showToastOnDenied) {
        toast({
          title: "Access Denied",
          description: deniedMessage || deniedReason,
          variant: "destructive",
        });
      }
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  const button = (
    <AnimatedButton {...props} disabled={!hasAccess || props.disabled} onClick={handleClick}>
      {children}
    </AnimatedButton>
  );
  
  if (!hasAccess && !hideIfNoPermission) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{deniedMessage || deniedReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default PermissionButton;
