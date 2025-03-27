export type Permission = 
  | 'users.read'
  | 'users.write'
  | 'financials.read'
  | 'financials.write'
  | 'forecasts.read'
  | 'forecasts.write'
  | 'reports.read'
  | 'reports.write'
  | 'admin.access'
  | 'driver.claim_packages';

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
  status: 'active' | 'inactive';
};

// Predefined roles
export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access and user management capabilities',
    permissions: [
      'users.read', 'users.write',
      'financials.read', 'financials.write',
      'forecasts.read', 'forecasts.write',
      'reports.read', 'reports.write',
      'admin.access',
      'driver.claim_packages'
    ]
  },
  FINANCE_MANAGER: {
    id: 'finance_manager',
    name: 'Finance Manager',
    description: 'Can read and write all financial data',
    permissions: [
      'financials.read', 'financials.write',
      'forecasts.read', 'forecasts.write',
      'reports.read', 'reports.write'
    ]
  },
  ANALYST: {
    id: 'analyst',
    name: 'Analyst',
    description: 'Can read all financial data and write forecasts',
    permissions: [
      'financials.read',
      'forecasts.read', 'forecasts.write',
      'reports.read'
    ]
  },
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to reports and financials',
    permissions: [
      'financials.read',
      'reports.read'
    ]
  }
};
