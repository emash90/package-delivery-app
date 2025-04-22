
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { logger } from '../../infrastructure/logger';
import { IPackageService } from '../../application/services/IPackageService';
import { Types } from 'mongoose';

export class PackageController {
  constructor(private packageService: IPackageService) {}
  
  trackPackage = async (req: Request, res: Response) => {
    try {
      const trackingId = req.params.id;
      const packageInfo = await this.packageService.trackPackage(trackingId);
      
      if (!packageInfo) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      res.status(200).json(packageInfo);
    } catch (error) {
      logger.error('Error tracking package:', error);
      res.status(500).json({ message: 'Failed to track package' });
    }
  };

  getAllPackages = async (req: AuthRequest, res: Response) => {
    try {
      const packages = await this.packageService.getAllPackages();
      res.status(200).json(packages);
    } catch (error) {
      logger.error('Error fetching packages:', error);
      res.status(500).json({ message: 'Failed to fetch packages' });
    }
  };

  getPackageById = async (req: AuthRequest, res: Response) => {
    try {
      const packageId = req.params.id;
      const packageInfo = await this.packageService.getPackageById(packageId);
      
      if (!packageInfo) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      res.status(200).json(packageInfo);
    } catch (error) {
      logger.error('Error fetching package by ID:', error);
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
  

  getPackagesByOwnerId = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId;

        // Validate userId
        if (!userId || typeof userId !== 'string') {
          logger.warn('Invalid or missing userId in request:', { userId });
          return res.status(400).json({ message: 'User ID is required and must be a string' });
        }
  
        // Optional: Validate as a hex string (24 characters)
        if (!Types.ObjectId.isValid(userId)) {
          logger.warn('Invalid userId format:', { userId });
          return res.status(400).json({ message: 'Invalid user ID format' });
        }
      

      const packages = await this.packageService.getPackagesByOwnerId(userId);

      // Return packages (empty array if none found)
      res.status(200).json(packages || []);
    } catch (error) {
      logger.error('Error fetching packages by user ID:', error);
      res.status(500).json({ message: 'Failed to fetch packages' });
    }
  };

  createPackage = async (req: AuthRequest, res: Response) => {
    try {
      const ownerId = req.user?.id;
      
      if (!ownerId || req.user?.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied: Owner role required' });
      }
      
      const packageData = {
        ...req.body,
        ownerId,
        status: 'processing'
      };
      console.log("packageData", packageData)
      const newPackage = await this.packageService.createPackage(packageData);
      res.status(201).json(newPackage);
    } catch (error) {
      logger.error('Error creating package:', error);
      res.status(500).json({ message: 'Failed to create package' });
    }
  };

  getAvailablePackages = async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'driver') {
        return res.status(403).json({ message: 'Access denied: Driver role required' });
      }
      
      const packages = await this.packageService.getAvailablePackages();
      res.status(200).json(packages);
    } catch (error) {
      logger.error('Error fetching available packages:', error);
      res.status(500).json({ message: 'Failed to fetch available packages' });
    }
  };
}
