
import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { 
  User, 
  ROLES,
  Role
} from '@/types/permissions';
import GlassCard from '@/components/GlassCard';
import PermissionGuard from '@/components/PermissionGuard';
import { PlusCircle, Edit, Trash, Shield, Users } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';

// Mock data - in a real app this would come from your backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'super_admin',
    department: 'Administration',
    createdAt: '2023-07-12T00:00:00.000Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Finance Director',
    email: 'finance@example.com',
    role: 'finance_manager',
    department: 'Finance',
    createdAt: '2023-08-05T00:00:00.000Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Data Analyst',
    email: 'analyst@example.com',
    role: 'analyst',
    department: 'Business Intelligence',
    createdAt: '2023-09-18T00:00:00.000Z',
    status: 'active'
  },
  {
    id: '4',
    name: 'Marketing Team',
    email: 'marketing@example.com',
    role: 'viewer',
    department: 'Marketing',
    createdAt: '2023-10-22T00:00:00.000Z',
    status: 'active'
  },
  {
    id: '5',
    name: 'Sales Manager',
    email: 'sales@example.com',
    role: 'viewer',
    department: 'Sales',
    createdAt: '2023-11-14T00:00:00.000Z',
    status: 'inactive'
  }
];

const UserManagement = () => {
  const { hasPermission } = useUserPermission();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPermissionsDrawerOpen, setIsPermissionsDrawerOpen] = useState(false);
  
  // Function to manage user status (active/inactive)
  const toggleUserStatus = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };
  
  // Function to view a user's role details
  const viewRolePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDrawerOpen(true);
  };
  
  return (
    <PermissionGuard requiredPermission="admin.access">
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">User Management</h1>
                <p className="text-muted-foreground">
                  Manage users and control their permissions within the system
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <AnimatedButton 
                    className="flex items-center gap-2"
                    disabled={!hasPermission('users.write')}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add User
                  </AnimatedButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user and assign them to a role
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* This would be a form in a real implementation */}
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        className="col-span-3 h-10 rounded-md border border-input px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        className="col-span-3 h-10 rounded-md border border-input px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="role" className="text-right text-sm font-medium">
                        Role
                      </label>
                      <select
                        id="role"
                        className="col-span-3 h-10 rounded-md border border-input px-3 py-2"
                      >
                        {Object.values(ROLES).map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="department" className="text-right text-sm font-medium">
                        Department
                      </label>
                      <input
                        id="department"
                        className="col-span-3 h-10 rounded-md border border-input px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <AnimatedButton>Save User</AnimatedButton>
                  </div>
                </DialogContent>
              </Dialog>
            </header>
            
            {/* User list */}
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{ROLES[user.role]?.name || user.role}</td>
                        <td className="p-4">{user.department}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              user.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => viewRolePermissions(user)}
                            >
                              <Shield className="h-4 w-4" />
                              <span className="sr-only">View Permissions</span>
                            </AnimatedButton>
                            
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0"
                              disabled={!hasPermission('users.write')}
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit User</span>
                            </AnimatedButton>
                            
                            <AnimatedButton 
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              disabled={!hasPermission('users.write')}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete User</span>
                            </AnimatedButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
            
            {/* Role permissions drawer */}
            <Drawer open={isPermissionsDrawerOpen} onOpenChange={setIsPermissionsDrawerOpen}>
              <DrawerContent className="max-h-[85vh]">
                <div className="mx-auto w-full max-w-lg">
                  <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      User Role & Permissions
                    </DrawerTitle>
                    <DrawerDescription>
                      {selectedUser?.name} ({ROLES[selectedUser?.role || '']?.name})
                    </DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="p-4 pb-8">
                    {selectedUser && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Role Details</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {ROLES[selectedUser.role]?.description}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Permissions</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {ROLES[selectedUser.role]?.permissions.map((permission) => (
                              <div 
                                key={permission} 
                                className="flex items-center gap-2 p-2 rounded-md bg-muted"
                              >
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-sm">{permission}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </main>
        
        <Footer />
      </div>
    </PermissionGuard>
  );
};

export default UserManagement;
