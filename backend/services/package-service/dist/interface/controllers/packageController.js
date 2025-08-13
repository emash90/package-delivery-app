"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const logger_1 = require("../../infrastructure/logger");
const mongoose_1 = require("mongoose");
class PackageController {
    constructor(packageService) {
        this.packageService = packageService;
        this.trackPackage = async (req, res) => {
            try {
                const trackingId = req.params.id;
                const packageInfo = await this.packageService.trackPackage(trackingId);
                if (!packageInfo) {
                    return res.status(404).json({ message: 'Package not found' });
                }
                res.status(200).json(packageInfo);
            }
            catch (error) {
                logger_1.logger.error('Error tracking package:', error);
                res.status(500).json({ message: 'Failed to track package' });
            }
        };
        this.getAllPackages = async (req, res) => {
            try {
                const packages = await this.packageService.getAllPackages();
                res.status(200).json(packages);
            }
            catch (error) {
                logger_1.logger.error('Error fetching packages:', error);
                res.status(500).json({ message: 'Failed to fetch packages' });
            }
        };
        this.getPackageById = async (req, res) => {
            try {
                const packageId = req.params.id;
                const packageInfo = await this.packageService.getPackageById(packageId);
                if (!packageInfo) {
                    return res.status(404).json({ message: 'Package not found' });
                }
                res.status(200).json(packageInfo);
            }
            catch (error) {
                logger_1.logger.error('Error fetching package by ID:', error);
                res.status(500).json({ message: 'Failed to fetch package' });
            }
        };
        // getPackagesByOwnerId = async (req: AuthRequest, res: Response) => {
        //   try {
        //     const userId = req.params.userId;
        //     console.log("user id", userId)
        //     const packages = await this.packageService.getPackagesByOwnerId(userId);
        //     if (!packages || packages.length === 0) {
        //       console.log("No packages found for the user")
        //       logger.error('No packages found for the user')
        //       return res.status(404).json({ message: 'No packages found for the user' });
        //     }
        //     console.log("packages", packages)
        //     res.status(200).json(packages);
        //   } catch (error) {
        //     logger.error('Error fetching packages by user ID')
        //     res.status(500).json({ message: 'Failed to fetch packages' });
        //   }
        // };
        this.getPackagesByOwnerId = async (req, res) => {
            try {
                const userId = req.params.userId;
                // Validate userId
                if (!userId || typeof userId !== 'string') {
                    logger_1.logger.warn('Invalid or missing userId in request:', { userId });
                    return res.status(400).json({ message: 'User ID is required and must be a string' });
                }
                // Optional: Validate as a hex string (24 characters)
                if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                    logger_1.logger.warn('Invalid userId format:', { userId });
                    return res.status(400).json({ message: 'Invalid user ID format' });
                }
                const packages = await this.packageService.getPackagesByOwnerId(userId);
                // Return packages (empty array if none found)
                res.status(200).json(packages || []);
            }
            catch (error) {
                logger_1.logger.error('Error fetching packages by user ID:', error);
                res.status(500).json({ message: 'Failed to fetch packages' });
            }
        };
        this.createPackage = async (req, res) => {
            var _a, _b;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!ownerId || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'owner') {
                    return res.status(403).json({ message: 'Access denied: Owner role required' });
                }
                const packageData = {
                    ...req.body,
                    ownerId,
                    status: 'processing'
                };
                console.log("packageData", packageData);
                const newPackage = await this.packageService.createPackage(packageData);
                res.status(201).json(newPackage);
            }
            catch (error) {
                logger_1.logger.error('Error creating package:', error);
                res.status(500).json({ message: 'Failed to create package' });
            }
        };
        this.getAvailablePackages = async (req, res) => {
            var _a;
            try {
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'driver') {
                    return res.status(403).json({ message: 'Access denied: Driver role required' });
                }
                const packages = await this.packageService.getAvailablePackages();
                res.status(200).json(packages);
            }
            catch (error) {
                logger_1.logger.error('Error fetching available packages:', error);
                res.status(500).json({ message: 'Failed to fetch available packages' });
            }
        };
    }
}
exports.PackageController = PackageController;
