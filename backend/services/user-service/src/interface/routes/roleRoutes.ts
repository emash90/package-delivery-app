import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { PERMISSIONS } from '../../shared/constants/permissions';

const router = Router();
const roleController = new RoleController();

// All role routes require authentication
router.use(authMiddleware);

// Get all roles
router.get('/', requirePermission(PERMISSIONS.ROLES_READ), roleController.getAllRoles);

// Get role by ID
router.get('/:id', requirePermission(PERMISSIONS.ROLES_READ), roleController.getRoleById);

// Create role
router.post('/', requirePermission(PERMISSIONS.ROLES_CREATE), roleController.createRole);

// Update role
router.put('/:id', requirePermission(PERMISSIONS.ROLES_UPDATE), roleController.updateRole);

// Delete role
router.delete('/:id', requirePermission(PERMISSIONS.ROLES_DELETE), roleController.deleteRole);

export { router as roleRouter };