
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import Logo from "@/components/Logo";
import AnimatedButton from "@/components/AnimatedButton";
import { PackageOpen, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-transparent p-6">
        <div className="max-w-md w-full text-center">
          <Logo className="mx-auto mb-6" />
          
          <div className="relative py-12">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <PackageOpen className="w-60 h-60" strokeWidth={0.5} />
            </div>
            
            <h1 className="text-8xl font-display font-bold text-primary/90 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Package Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
            
            <AnimatedButton className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" />
              <a href="/">Return Home</a>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
