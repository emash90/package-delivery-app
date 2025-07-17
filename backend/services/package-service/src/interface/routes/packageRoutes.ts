
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requirePermission, requireAnyPermission, checkPackageOwnership } from '../middlewares/rbacMiddleware';
import { PERMISSIONS } from '../../shared/constants/permissions';
import { PackageController } from '../controllers/packageController';
import { PackageService } from '../../application/services/PackageService';
import { PackageRepository } from '../../infrastructure/repositories/PackageRepository';
import { MessagePublisher } from '../../infrastructure/messageBroker/index'

const router = express.Router();

// Initialize dependencies
const packageRepository = new PackageRepository();
const messagePublisher = new MessagePublisher();
const packageService = new PackageService(packageRepository, messagePublisher);
const packageController = new PackageController(packageService);

// Public route for tracking packages by ID
router.get('/track/:id', packageController.trackPackage);

// Get all packages (requires authentication and read permission)
router.get('/available', authMiddleware, requirePermission(PERMISSIONS.PACKAGES_READ), packageController.getAllPackages);

// Get package by ID (requires authentication and read permission)
router.get('/:id', authMiddleware, requirePermission(PERMISSIONS.PACKAGES_READ), packageController.getPackageById);

// Get package by userId (authentication required, with ownership check)
router.get('/user/:userId', authMiddleware, requirePermission(PERMISSIONS.PACKAGES_READ), checkPackageOwnership, packageController.getPackagesByOwnerId);

// Create a new package (requires authentication and create permission)
router.post('/', authMiddleware, requirePermission(PERMISSIONS.PACKAGES_CREATE), packageController.createPackage);

// Get available packages (for drivers, requires authentication and read permission)
router.get('/available', authMiddleware, requirePermission(PERMISSIONS.PACKAGES_READ), packageController.getAvailablePackages);

export { router as packageRouter };
