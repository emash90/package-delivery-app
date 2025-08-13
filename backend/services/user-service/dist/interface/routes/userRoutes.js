"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userValidators_1 = require("../validators/userValidators");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const permissions_1 = require("../../shared/constants/permissions");
const roleRoutes_1 = require("./roleRoutes");
const permissionRoutes_1 = require("./permissionRoutes");
const router = (0, express_1.Router)();
exports.userRouter = router;
// Auth routes
router.post('/register', userValidators_1.validateRegister, userController_1.userController.register);
router.post('/login', userValidators_1.validateLogin, userController_1.userController.login);
// Protected routes
router.get('/me', authMiddleware_1.authMiddleware, userController_1.userController.getCurrentUser);
router.put('/profile', authMiddleware_1.authMiddleware, userController_1.userController.updateProfile);
// Admin routes
router.get('/', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USERS_READ), userController_1.userController.getAllUsers);
// Driver info routes (for package owners to view carrier info)
router.get('/driver/:driverId/info', authMiddleware_1.authMiddleware, userController_1.userController.getDriverInfo);
router.get('/package/:packageId/driver', authMiddleware_1.authMiddleware, userController_1.userController.getDriverInfoForPackage);
// Role and permission routes
router.use('/roles', roleRoutes_1.roleRouter);
router.use('/permissions', permissionRoutes_1.permissionRouter);
