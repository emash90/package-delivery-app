
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'panel';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const baseClasses = 'rounded-xl shadow-soft';
  
  const variantClasses = {
    default: 'glass-card',
    dark: 'glass-dark text-white',
    panel: 'glass-panel'
  };
  
  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      'transition-all-300',
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
