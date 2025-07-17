export const PERMISSIONS = {
  // Delivery permissions
  DELIVERIES_READ: 'deliveries.read',
  DELIVERIES_CLAIM: 'deliveries.claim',
  DELIVERIES_UPDATE: 'deliveries.update',
  DELIVERIES_COMPLETE: 'deliveries.complete',
  DELIVERIES_VIEW_ALL: 'deliveries.view_all',
  DELIVERIES_ASSIGN: 'deliveries.assign',
  
  // Admin permissions
  ADMIN_ACCESS: 'admin.access',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];