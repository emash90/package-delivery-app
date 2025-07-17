import { Router } from 'express';
import { PermissionController } from '../controllers/permissionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { PERMISSIONS } from '../../shared/constants/permissions';

const router = Router();
const permissionController = new PermissionController();

// All permission routes require authentication
router.use(authMiddleware);

// Get all permissions
router.get('/', requirePermission(PERMISSIONS.ADMIN_ACCESS), permissionController.getAllPermissions);

// Create permission
router.post('/', requirePermission(PERMISSIONS.ADMIN_ACCESS), permissionController.createPermission);

export { router as permissionRouter };