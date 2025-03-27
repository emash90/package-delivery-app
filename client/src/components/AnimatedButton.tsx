
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'transition-all-300 hover:scale-[1.02] active:scale-[0.98]',
        'relative overflow-hidden',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-all-300" />
    </Button>
  );
};

export default AnimatedButton;
