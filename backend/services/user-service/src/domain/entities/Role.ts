export interface Role {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}