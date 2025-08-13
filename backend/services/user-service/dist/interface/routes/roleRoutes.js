"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = require("express");
const roleController_1 = require("../controllers/roleController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const permissions_1 = require("../../shared/constants/permissions");
const router = (0, express_1.Router)();
exports.roleRouter = router;
const roleController = new roleController_1.RoleController();
// All role routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Get all roles
router.get('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ROLES_READ), roleController.getAllRoles);
// Get role by ID
router.get('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ROLES_READ), roleController.getRoleById);
// Create role
router.post('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ROLES_CREATE), roleController.createRole);
// Update role
router.put('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ROLES_UPDATE), roleController.updateRole);
// Delete role
router.delete('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ROLES_DELETE), roleController.deleteRole);
