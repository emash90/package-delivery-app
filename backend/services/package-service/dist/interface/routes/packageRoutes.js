"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const permissions_1 = require("../../shared/constants/permissions");
const packageController_1 = require("../controllers/packageController");
const PackageService_1 = require("../../application/services/PackageService");
const PackageRepository_1 = require("../../infrastructure/repositories/PackageRepository");
const index_1 = require("../../infrastructure/messageBroker/index");
const router = express_1.default.Router();
exports.packageRouter = router;
// Initialize dependencies
const packageRepository = new PackageRepository_1.PackageRepository();
const messagePublisher = new index_1.MessagePublisher();
const packageService = new PackageService_1.PackageService(packageRepository, messagePublisher);
const packageController = new packageController_1.PackageController(packageService);
// Public route for tracking packages by ID
router.get('/track/:id', packageController.trackPackage);
// Get all packages (requires authentication and read permission)
router.get('/available', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.PACKAGES_READ), packageController.getAllPackages);
// Get package by ID (requires authentication and read permission)
router.get('/:id', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.PACKAGES_READ), packageController.getPackageById);
// Get package by userId (authentication required, with ownership check)
router.get('/user/:userId', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.PACKAGES_READ), rbacMiddleware_1.checkPackageOwnership, packageController.getPackagesByOwnerId);
// Create a new package (requires authentication and create permission)
router.post('/', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.PACKAGES_CREATE), packageController.createPackage);
// Get available packages (for drivers, requires authentication and read permission)
router.get('/available', authMiddleware_1.authMiddleware, (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.PACKAGES_READ), packageController.getAvailablePackages);
