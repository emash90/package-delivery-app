
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useUserPermission } from '@/contexts/UserPermissionContext';
import { 
  User, 
  ROLES,
  PERMISSIONS,
  UserRole,
  getPermissionDescription
} from '@/types/permissions';
import GlassCard from '@/components/GlassCard';
import PermissionGuard from '@/components/PermissionGuard';
import PermissionButton from '@/components/PermissionButton';
import { PlusCircle, Edit, Trash, Shield, Search, Filter } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { userApi } from '@/services/api';
import { cn } from '@/lib/utils';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPermissionsDrawerOpen, setIsPermissionsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'owner' as UserRole,
    status: 'active' as 'active' | 'inactive' | 'suspended',
    password: ''
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'owner',
      status: 'active',
      password: ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        await userApi.updateUser(selectedUser.id, formData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await userApi.register({
          ...formData,
          password: formData.password || 'temp123' // Use provided password or temp password
        });
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      }
      setIsCreateDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        loadUsers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };
  
  // Function to view a user's role details
  const viewRolePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDrawerOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'owner': return 'bg-blue-100 text-blue-800';
      case 'driver': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <PermissionGuard requiredPermission={PERMISSIONS.ADMIN_MANAGE_USERS}>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-6">
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
                  <Shield className="w-8 h-8" />
                  User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage users and control their permissions within the system
                </p>
              </div>
              
              <PermissionButton
                permission={PERMISSIONS.USERS_CREATE}
                className="flex items-center gap-2"
                onClick={handleCreateUser}
              >
                <PlusCircle className="h-4 w-4" />
                Add User
              </PermissionButton>
            </header>

            {/* Filters */}
            <GlassCard className="mb-6">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="text-lg font-medium">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
            
            {/* User list */}
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Last Login</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              getRoleColor(user.role)
                            )}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              user.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : user.status === "suspended"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
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
                            
                            <PermissionButton
                              permission={PERMISSIONS.USERS_UPDATE}
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit User</span>
                            </PermissionButton>
                            
                            <PermissionButton
                              permission={PERMISSIONS.USERS_DELETE}
                              size="sm" 
                              variant="outline"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete User</span>
                            </PermissionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
            
            {/* User Creation/Edit Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create New User'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedUser 
                      ? 'Update user information and permissions' 
                      : 'Add a new user to the system'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      disabled={!!selectedUser}
                    />
                  </div>
                  
                  {!selectedUser && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password (leave blank for temp password)"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                        setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveUser}
                    disabled={!formData.name || !formData.email}
                  >
                    {selectedUser ? 'Update User' : 'Create User'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
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
                          <div className="grid grid-cols-1 gap-3">
                            {selectedUser.permissions?.map((permission) => (
                              <div 
                                key={permission} 
                                className="flex items-center gap-2 p-3 rounded-md bg-muted"
                              >
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{permission}</span>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {getPermissionDescription(permission)}
                                  </p>
                                </div>
                              </div>
                            )) || (
                              <div className="text-sm text-muted-foreground">
                                No specific permissions assigned. Using default role permissions.
                              </div>
                            )}
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
