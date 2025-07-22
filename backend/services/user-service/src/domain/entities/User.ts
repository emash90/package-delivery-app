
export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'driver' | 'admin';
  roleId?: string;
  permissions?: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'driver' | 'admin';
  roleId?: string;
  permissions?: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}
