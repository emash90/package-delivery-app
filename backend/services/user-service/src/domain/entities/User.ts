
export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'driver' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'driver' | 'admin';
  token?: string;
}
