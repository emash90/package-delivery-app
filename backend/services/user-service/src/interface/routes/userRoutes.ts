
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateLogin, validateRegister } from '../validators/userValidators';

const router = Router();

// Auth routes
router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);

// Protected routes
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, userController.updateProfile);

// Admin routes
router.get('/', authMiddleware, userController.getAllUsers);

export { router as userRouter };
