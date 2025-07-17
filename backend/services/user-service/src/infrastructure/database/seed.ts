import mongoose from 'mongoose';
import { PermissionModel } from '../models/PermissionModel';
import { RoleModel } from '../models/RoleModel';
import { PERMISSIONS, RESOURCES, ACTIONS, DEFAULT_PERMISSIONS } from '../../shared/constants/permissions';

export const seedPermissions = async () => {
  try {
    console.log('Seeding permissions...');
    
    const permissions = [
      // User permissions
      { name: PERMISSIONS.USERS_READ, description: 'Read user information', resource: RESOURCES.USER, action: ACTIONS.READ },
      { name: PERMISSIONS.USERS_CREATE, description: 'Create new users', resource: RESOURCES.USER, action: ACTIONS.CREATE },
      { name: PERMISSIONS.USERS_UPDATE, description: 'Update user information', resource: RESOURCES.USER, action: ACTIONS.UPDATE },
      { name: PERMISSIONS.USERS_DELETE, description: 'Delete users', resource: RESOURCES.USER, action: ACTIONS.DELETE },
      { name: PERMISSIONS.USERS_MANAGE_ROLES, description: 'Manage user roles', resource: RESOURCES.USER, action: ACTIONS.MANAGE_ROLES },
      
      // Package permissions
      { name: PERMISSIONS.PACKAGES_READ, description: 'Read package information', resource: RESOURCES.PACKAGE, action: ACTIONS.READ },
      { name: PERMISSIONS.PACKAGES_CREATE, description: 'Create new packages', resource: RESOURCES.PACKAGE, action: ACTIONS.CREATE },
      { name: PERMISSIONS.PACKAGES_UPDATE, description: 'Update package information', resource: RESOURCES.PACKAGE, action: ACTIONS.UPDATE },
      { name: PERMISSIONS.PACKAGES_DELETE, description: 'Delete packages', resource: RESOURCES.PACKAGE, action: ACTIONS.DELETE },
      { name: PERMISSIONS.PACKAGES_TRACK, description: 'Track package status', resource: RESOURCES.PACKAGE, action: ACTIONS.TRACK },
      { name: PERMISSIONS.PACKAGES_VIEW_ALL, description: 'View all packages', resource: RESOURCES.PACKAGE, action: ACTIONS.VIEW_ALL },
      
      // Delivery permissions
      { name: PERMISSIONS.DELIVERIES_READ, description: 'Read delivery information', resource: RESOURCES.DELIVERY, action: ACTIONS.READ },
      { name: PERMISSIONS.DELIVERIES_CLAIM, description: 'Claim delivery jobs', resource: RESOURCES.DELIVERY, action: ACTIONS.CLAIM },
      { name: PERMISSIONS.DELIVERIES_UPDATE, description: 'Update delivery status', resource: RESOURCES.DELIVERY, action: ACTIONS.UPDATE },
      { name: PERMISSIONS.DELIVERIES_COMPLETE, description: 'Complete deliveries', resource: RESOURCES.DELIVERY, action: ACTIONS.COMPLETE },
      { name: PERMISSIONS.DELIVERIES_VIEW_ALL, description: 'View all deliveries', resource: RESOURCES.DELIVERY, action: ACTIONS.VIEW_ALL },
      { name: PERMISSIONS.DELIVERIES_ASSIGN, description: 'Assign deliveries to drivers', resource: RESOURCES.DELIVERY, action: ACTIONS.ASSIGN },
      
      // Admin permissions
      { name: PERMISSIONS.ADMIN_ACCESS, description: 'Access admin panel', resource: RESOURCES.ADMIN, action: ACTIONS.ACCESS },
      { name: PERMISSIONS.ADMIN_MANAGE_USERS, description: 'Manage all users', resource: RESOURCES.ADMIN, action: ACTIONS.MANAGE_USERS },
      { name: PERMISSIONS.ADMIN_MANAGE_ROLES, description: 'Manage roles and permissions', resource: RESOURCES.ADMIN, action: ACTIONS.MANAGE_ROLES },
      { name: PERMISSIONS.ADMIN_VIEW_ANALYTICS, description: 'View system analytics', resource: RESOURCES.ADMIN, action: ACTIONS.VIEW_ANALYTICS },
      { name: PERMISSIONS.ADMIN_SYSTEM_CONFIG, description: 'Configure system settings', resource: RESOURCES.ADMIN, action: ACTIONS.SYSTEM_CONFIG },
      
      // Role permissions
      { name: PERMISSIONS.ROLES_READ, description: 'Read role information', resource: RESOURCES.ROLE, action: ACTIONS.READ },
      { name: PERMISSIONS.ROLES_CREATE, description: 'Create new roles', resource: RESOURCES.ROLE, action: ACTIONS.CREATE },
      { name: PERMISSIONS.ROLES_UPDATE, description: 'Update role information', resource: RESOURCES.ROLE, action: ACTIONS.UPDATE },
      { name: PERMISSIONS.ROLES_DELETE, description: 'Delete roles', resource: RESOURCES.ROLE, action: ACTIONS.DELETE },
    ];

    for (const permission of permissions) {
      await PermissionModel.findOneAndUpdate(
        { name: permission.name },
        permission,
        { upsert: true, new: true }
      );
    }

    console.log('Permissions seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding permissions:', error);
    return false;
  }
};

export const seedRoles = async () => {
  try {
    console.log('Seeding roles...');

    // Get all permission IDs
    const allPermissions = await PermissionModel.find();
    const permissionMap = new Map(allPermissions.map(p => [p.name, p._id]));

    const roles = [
      {
        name: 'Owner',
        description: 'Package owners who can create and manage their packages',
        permissions: DEFAULT_PERMISSIONS.owner.map(p => permissionMap.get(p)).filter(Boolean),
        isActive: true
      },
      {
        name: 'Driver',
        description: 'Delivery drivers who can claim and complete deliveries',
        permissions: DEFAULT_PERMISSIONS.driver.map(p => permissionMap.get(p)).filter(Boolean),
        isActive: true
      },
      {
        name: 'Admin',
        description: 'System administrators with full access',
        permissions: DEFAULT_PERMISSIONS.admin.map(p => permissionMap.get(p)).filter(Boolean),
        isActive: true
      }
    ];

    for (const role of roles) {
      await RoleModel.findOneAndUpdate(
        { name: role.name },
        role,
        { upsert: true, new: true }
      );
    }

    console.log('Roles seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding roles:', error);
    return false;
  }
};

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await seedPermissions();
    await seedRoles();
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};