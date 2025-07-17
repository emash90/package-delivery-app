export const PERMISSIONS = {
  // Package permissions
  PACKAGES_READ: 'packages.read',
  PACKAGES_CREATE: 'packages.create',
  PACKAGES_UPDATE: 'packages.update',
  PACKAGES_DELETE: 'packages.delete',
  PACKAGES_TRACK: 'packages.track',
  PACKAGES_VIEW_ALL: 'packages.view_all',
  
  // Admin permissions
  ADMIN_ACCESS: 'admin.access',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];