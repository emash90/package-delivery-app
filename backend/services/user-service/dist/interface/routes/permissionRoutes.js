"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRouter = void 0;
const express_1 = require("express");
const permissionController_1 = require("../controllers/permissionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const permissions_1 = require("../../shared/constants/permissions");
const router = (0, express_1.Router)();
exports.permissionRouter = router;
const permissionController = new permissionController_1.PermissionController();
// All permission routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Get all permissions
router.get('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ADMIN_ACCESS), permissionController.getAllPermissions);
// Create permission
router.post('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.ADMIN_ACCESS), permissionController.createPermission);
