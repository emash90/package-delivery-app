
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import PermissionGuard from "@/components/PermissionGuard";
import { UserPermissionProvider } from "@/contexts/UserPermissionContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/owner/Dashboard";
import DriverDashboard from "./pages/driver/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import PackageDetail from "./pages/owner/PackageDetail";
import CreatePackage from "./pages/owner/CreatePackage";
import TrackPackage from "./pages/TrackPackage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: any) => {
          toast.error(error.message || "An error occurred");
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          toast.error(error.message || "An error occurred");
        }
      }
    }
  }
});

const AppContent = () => {
  const dispatch = useAppDispatch();

  // Fetch current user on app load if token exists
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/track" element={<TrackPackage />} />
      
      {/* Package Owner Routes - Only accessible by owners */}
      <Route 
        path="/owner/dashboard" 
        element={
          <PermissionGuard requiredRole="owner" fallbackPath="/">
            <OwnerDashboard />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/owner/package/:id" 
        element={
          <PermissionGuard requiredRole="owner" fallbackPath="/">
            <PackageDetail />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/owner/create-package" 
        element={
          <PermissionGuard requiredRole="owner" fallbackPath="/">
            <CreatePackage />
          </PermissionGuard>
        } 
      />
      
      {/* Driver Routes - Only accessible by drivers */}
      <Route 
        path="/driver/dashboard" 
        element={
          <PermissionGuard requiredRole="driver" fallbackPath="/">
            <DriverDashboard />
          </PermissionGuard>
        } 
      />
      
      {/* Admin Routes - Only accessible by admins */}
      <Route 
        path="/admin/dashboard" 
        element={
          <PermissionGuard requiredRole="admin" fallbackPath="/">
            <AdminDashboard />
          </PermissionGuard>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <PermissionGuard requiredRole="admin" fallbackPath="/">
            <UserManagement />
          </PermissionGuard>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPermissionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </UserPermissionProvider>
  </QueryClientProvider>
);

export default App;
