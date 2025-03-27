
import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <Package className="h-8 w-8 text-primary animate-float" strokeWidth={1.5} />
      </div>
      {!iconOnly && (
        <span className="font-display text-xl font-semibold tracking-tight">Packaroo</span>
      )}
    </div>
  );
};

export default Logo;
