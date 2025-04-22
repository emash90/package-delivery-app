
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Github, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-muted-foreground text-sm">
              Fast, reliable package delivery for everyone. Track your packages in real-time.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all-200">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-all-200">Home</Link></li>
              <li><Link to="/track" className="text-muted-foreground hover:text-primary transition-all-200">Track Package</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-all-200">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-all-200">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-base mb-4">For Users</h3>
            <ul className="space-y-2">
              <li><Link to="/owner/dashboard" className="text-muted-foreground hover:text-primary transition-all-200">Package Owner</Link></li>
              <li><Link to="/driver/dashboard" className="text-muted-foreground hover:text-primary transition-all-200">Delivery Driver</Link></li>
              <li><Link to="/admin/dashboard" className="text-muted-foreground hover:text-primary transition-all-200">Admin Portal</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all-200">API Access</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-base mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all-200">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all-200">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all-200">Cookie Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary transition-all-200">Licenses</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Packaroo. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Designed and built with precision
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
