
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { PackageController } from '../controllers/packageController';
import { PackageService } from '../../application/services/PackageService';
import { PackageRepository } from '../../infrastructure/repositories/PackageRepository';
import { MessagePublisher } from '../../infrastructure/messageBroker'

const router = express.Router();

// Initialize dependencies
const packageRepository = new PackageRepository();
const messagePublisher = new MessagePublisher();
const packageService = new PackageService(packageRepository, messagePublisher);
const packageController = new PackageController(packageService);

// Public route for tracking packages by ID
router.get('/track/:id', packageController.trackPackage);

// Get all packages (requires authentication)
router.get('/available', authMiddleware, packageController.getAllPackages);

// Get package by ID (requires authentication)
router.get('/:id', authMiddleware, packageController.getPackageById);

//Get package by userId (authentication required)

router.get('/user/:userId', authMiddleware, packageController.getPackagesByOwnerId);



// Create a new package (requires authentication)
router.post('/', authMiddleware, packageController.createPackage);

// Get available packages (for drivers, requires authentication)
router.get('/available', authMiddleware, packageController.getAvailablePackages);

export { router as packageRouter };
