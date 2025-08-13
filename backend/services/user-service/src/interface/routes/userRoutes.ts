
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateLogin, validateRegister } from '../validators/userValidators';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { PERMISSIONS } from '../../shared/constants/permissions';
import { roleRouter } from './roleRoutes';
import { permissionRouter } from './permissionRoutes';

const router = Router();

// Auth routes
router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, userController.updateProfile);

// Admin routes
router.get('/', authMiddleware, requirePermission(PERMISSIONS.USERS_READ), userController.getAllUsers);

// Driver info routes (for package owners to view carrier info)
router.get('/driver/:driverId/info', authMiddleware, userController.getDriverInfo);
router.get('/package/:packageId/driver', authMiddleware, userController.getDriverInfoForPackage);

// Role and permission routes
router.use('/roles', roleRouter);
router.use('/permissions', permissionRouter);

export { router as userRouter };
