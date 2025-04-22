
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { toast } from "sonner";

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
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/package/:id" element={<PackageDetail />} />
      <Route path="/owner/create-package" element={<CreatePackage />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
