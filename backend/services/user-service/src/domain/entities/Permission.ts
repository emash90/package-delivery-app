export interface Permission {
  id?: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}