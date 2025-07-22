
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setSelectedRole } from '@/store/slices/authSlice';
import type { UserRole } from '@/store/slices/authSlice';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  role: UserRole | 'admin';
  className?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  role,
  className,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  const handleRoleSelect = () => {
    // If user is already authenticated and has the role, navigate to their dashboard
    if (user && user.role === role) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'driver') {
        navigate('/driver/dashboard');
      } else if (role === 'owner') {
        navigate('/owner/dashboard');
      }
    } else {
      // Otherwise, set the selected role and navigate to registration
      dispatch(setSelectedRole(role as UserRole));
      navigate('/register');
    }
  };

  return (
    <div onClick={handleRoleSelect} className="block group cursor-pointer">
      <GlassCard className={cn(
        'p-6 hover-scale cursor-pointer',
        'border border-transparent hover:border-primary/20 h-full',
        className
      )}>
        <div className="flex flex-col gap-4 h-full">
          <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center text-primary">
            {icon}
          </div>
          
          <div className="flex flex-col gap-2 flex-grow">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="rounded-full p-2 bg-primary/10 group-hover:bg-primary/20 transition-all-300">
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-all-300" />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default RoleCard;
