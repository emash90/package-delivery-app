import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import AnimatedButton from './AnimatedButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';

interface NavLink {
  label: string;
  href: string;
}

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    if (user?.role !== 'driver') {
      navigate('/');
    }
    dispatch(logout());
  };

  const handleButtonClick = () => {
    if (user?.role === 'owner') {
      navigate('/owner/dashboard');
    } else if (user?.role === 'driver') {
      navigate('/driver/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all-300 py-4',
      isScrolled ? 'glass-panel shadow-md py-3' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="z-10">
          <Logo className="transition-all-300" />
        </Link>
        
        <nav className={cn('items-center space-x-1 hidden md:flex')}>
          <button onClick={handleButtonClick} className="px-4 py-2 rounded-md text-foreground/80 hover:text-foreground transition-all-300">
            Dashboard
          </button>

          <div className="pl-4 flex space-x-2">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-all-300"
                >
                  <User className="h-6 w-6" />
                  <span>{user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <AnimatedButton variant="ghost">Sign In</AnimatedButton>
                </Link>
                <Link to="/register">
                  <AnimatedButton>Register</AnimatedButton>
                </Link>
              </>
            )}
          </div>
        </nav>
        
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden z-10 p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm animate-fade-in flex flex-col md:hidden">
            <div className="container h-full flex flex-col pt-20 pb-8 px-6">
              <nav className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={handleButtonClick} 
                  className="px-4 py-3 text-lg rounded-md text-foreground/80 hover:text-foreground transition-all-300"
                >
                  Dashboard
                </button>

                <div className="pt-4 flex flex-col space-y-2">
                  {user ? (
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  ) : (
                    <>
                      <Link to="/login">
                        <AnimatedButton variant="ghost" className="w-full justify-center">
                          Sign In
                        </AnimatedButton>
                      </Link>
                      <Link to="/register">
                        <AnimatedButton className="w-full justify-center">
                          Register
                        </AnimatedButton>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
