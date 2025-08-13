"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = exports.seedRoles = exports.seedPermissions = void 0;
const PermissionModel_1 = require("../models/PermissionModel");
const RoleModel_1 = require("../models/RoleModel");
const permissions_1 = require("../../shared/constants/permissions");
const seedPermissions = async () => {
    try {
        console.log('Seeding permissions...');
        const permissions = [
            // User permissions
            { name: permissions_1.PERMISSIONS.USERS_READ, description: 'Read user information', resource: permissions_1.RESOURCES.USER, action: permissions_1.ACTIONS.READ },
            { name: permissions_1.PERMISSIONS.USERS_CREATE, description: 'Create new users', resource: permissions_1.RESOURCES.USER, action: permissions_1.ACTIONS.CREATE },
            { name: permissions_1.PERMISSIONS.USERS_UPDATE, description: 'Update user information', resource: permissions_1.RESOURCES.USER, action: permissions_1.ACTIONS.UPDATE },
            { name: permissions_1.PERMISSIONS.USERS_DELETE, description: 'Delete users', resource: permissions_1.RESOURCES.USER, action: permissions_1.ACTIONS.DELETE },
            { name: permissions_1.PERMISSIONS.USERS_MANAGE_ROLES, description: 'Manage user roles', resource: permissions_1.RESOURCES.USER, action: permissions_1.ACTIONS.MANAGE_ROLES },
            // Package permissions
            { name: permissions_1.PERMISSIONS.PACKAGES_READ, description: 'Read package information', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.READ },
            { name: permissions_1.PERMISSIONS.PACKAGES_CREATE, description: 'Create new packages', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.CREATE },
            { name: permissions_1.PERMISSIONS.PACKAGES_UPDATE, description: 'Update package information', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.UPDATE },
            { name: permissions_1.PERMISSIONS.PACKAGES_DELETE, description: 'Delete packages', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.DELETE },
            { name: permissions_1.PERMISSIONS.PACKAGES_TRACK, description: 'Track package status', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.TRACK },
            { name: permissions_1.PERMISSIONS.PACKAGES_VIEW_ALL, description: 'View all packages', resource: permissions_1.RESOURCES.PACKAGE, action: permissions_1.ACTIONS.VIEW_ALL },
            // Delivery permissions
            { name: permissions_1.PERMISSIONS.DELIVERIES_READ, description: 'Read delivery information', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.READ },
            { name: permissions_1.PERMISSIONS.DELIVERIES_CLAIM, description: 'Claim delivery jobs', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.CLAIM },
            { name: permissions_1.PERMISSIONS.DELIVERIES_UPDATE, description: 'Update delivery status', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.UPDATE },
            { name: permissions_1.PERMISSIONS.DELIVERIES_COMPLETE, description: 'Complete deliveries', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.COMPLETE },
            { name: permissions_1.PERMISSIONS.DELIVERIES_VIEW_ALL, description: 'View all deliveries', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.VIEW_ALL },
            { name: permissions_1.PERMISSIONS.DELIVERIES_ASSIGN, description: 'Assign deliveries to drivers', resource: permissions_1.RESOURCES.DELIVERY, action: permissions_1.ACTIONS.ASSIGN },
            // Admin permissions
            { name: permissions_1.PERMISSIONS.ADMIN_ACCESS, description: 'Access admin panel', resource: permissions_1.RESOURCES.ADMIN, action: permissions_1.ACTIONS.ACCESS },
            { name: permissions_1.PERMISSIONS.ADMIN_MANAGE_USERS, description: 'Manage all users', resource: permissions_1.RESOURCES.ADMIN, action: permissions_1.ACTIONS.MANAGE_USERS },
            { name: permissions_1.PERMISSIONS.ADMIN_MANAGE_ROLES, description: 'Manage roles and permissions', resource: permissions_1.RESOURCES.ADMIN, action: permissions_1.ACTIONS.MANAGE_ROLES },
            { name: permissions_1.PERMISSIONS.ADMIN_VIEW_ANALYTICS, description: 'View system analytics', resource: permissions_1.RESOURCES.ADMIN, action: permissions_1.ACTIONS.VIEW_ANALYTICS },
            { name: permissions_1.PERMISSIONS.ADMIN_SYSTEM_CONFIG, description: 'Configure system settings', resource: permissions_1.RESOURCES.ADMIN, action: permissions_1.ACTIONS.SYSTEM_CONFIG },
            // Role permissions
            { name: permissions_1.PERMISSIONS.ROLES_READ, description: 'Read role information', resource: permissions_1.RESOURCES.ROLE, action: permissions_1.ACTIONS.READ },
            { name: permissions_1.PERMISSIONS.ROLES_CREATE, description: 'Create new roles', resource: permissions_1.RESOURCES.ROLE, action: permissions_1.ACTIONS.CREATE },
            { name: permissions_1.PERMISSIONS.ROLES_UPDATE, description: 'Update role information', resource: permissions_1.RESOURCES.ROLE, action: permissions_1.ACTIONS.UPDATE },
            { name: permissions_1.PERMISSIONS.ROLES_DELETE, description: 'Delete roles', resource: permissions_1.RESOURCES.ROLE, action: permissions_1.ACTIONS.DELETE },
        ];
        for (const permission of permissions) {
            await PermissionModel_1.PermissionModel.findOneAndUpdate({ name: permission.name }, permission, { upsert: true, new: true });
        }
        console.log('Permissions seeded successfully');
        return true;
    }
    catch (error) {
        console.error('Error seeding permissions:', error);
        return false;
    }
};
exports.seedPermissions = seedPermissions;
const seedRoles = async () => {
    try {
        console.log('Seeding roles...');
        // Get all permission IDs
        const allPermissions = await PermissionModel_1.PermissionModel.find();
        const permissionMap = new Map(allPermissions.map(p => [p.name, p._id]));
        const roles = [
            {
                name: 'Owner',
                description: 'Package owners who can create and manage their packages',
                permissions: permissions_1.DEFAULT_PERMISSIONS.owner.map(p => permissionMap.get(p)).filter(Boolean),
                isActive: true
            },
            {
                name: 'Driver',
                description: 'Delivery drivers who can claim and complete deliveries',
                permissions: permissions_1.DEFAULT_PERMISSIONS.driver.map(p => permissionMap.get(p)).filter(Boolean),
                isActive: true
            },
            {
                name: 'Admin',
                description: 'System administrators with full access',
                permissions: permissions_1.DEFAULT_PERMISSIONS.admin.map(p => permissionMap.get(p)).filter(Boolean),
                isActive: true
            }
        ];
        for (const role of roles) {
            await RoleModel_1.RoleModel.findOneAndUpdate({ name: role.name }, role, { upsert: true, new: true });
        }
        console.log('Roles seeded successfully');
        return true;
    }
    catch (error) {
        console.error('Error seeding roles:', error);
        return false;
    }
};
exports.seedRoles = seedRoles;
const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');
        await (0, exports.seedPermissions)();
        await (0, exports.seedRoles)();
        console.log('Database seeding completed successfully');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};
exports.seedDatabase = seedDatabase;
