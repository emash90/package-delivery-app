
import React from 'react';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { Permission } from '@/types/permissions';
import AnimatedButton from '@/components/AnimatedButton';
import { ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PermissionButtonProps extends ButtonProps {
  permission?: Permission;
  hideIfNoPermission?: boolean;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  children,
  hideIfNoPermission = true,
  ...props
}) => {
  const { hasPermission } = useUserPermission();
  
  // If no permission is required, just show the button
  if (!permission) {
    return <AnimatedButton {...props}>{children}</AnimatedButton>;
  }
  
  const hasAccess = hasPermission(permission);
  
  if (!hasAccess && hideIfNoPermission) {
    return null;
  }
  
  const button = (
    <AnimatedButton {...props} disabled={!hasAccess || props.disabled}>
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
            <p>You don't have permission: {permission}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
};

export default PermissionButton;
