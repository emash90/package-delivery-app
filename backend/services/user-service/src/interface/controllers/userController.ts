
import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { RoleRepository } from '../../infrastructure/repositories/RoleRepository';
import { PermissionRepository } from '../../infrastructure/repositories/PermissionRepository';
import { PasswordService } from '../../infrastructure/services/PasswordService';
import { TokenService } from '../../infrastructure/services/TokenService';
import { MessagePublisher } from '../../infrastructure/messageBroker';
import { LoginUseCase } from '../../domain/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '../../domain/usecases/auth/RegisterUseCase';
import { GetCurrentUserUseCase } from '../../domain/usecases/user/GetCurrentUserUseCase';
import { logger } from '../../infrastructure/logger';

// Initialize repositories and services
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const passwordService = new PasswordService();
const tokenService = new TokenService();
const messagePublisher = new MessagePublisher();

// Initialize use cases
const loginUseCase = new LoginUseCase(userRepository, roleRepository, permissionRepository, passwordService, tokenService);
const registerUseCase = new RegisterUseCase(userRepository, passwordService, tokenService, messagePublisher);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

export const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await loginUseCase.execute(email, password);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;
      
      const user = await registerUseCase.execute({
        name,
        email,
        password,
        role,
        status: 'active'
      });
      
      if (!user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      res.status(201).json(user);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      
      const user = await getCurrentUserUseCase.execute(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      
      const updatedUser = await userRepository.update(userId, { name });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getAllUsers: async (req: Request, res: Response) => {
    try {
      // Only admin can access this endpoint
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const users = await userRepository.findAll();
      
      res.status(200).json(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })));
    } catch (error) {
      logger.error('Get all users error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getDriverInfoForPackage: async (req: Request, res: Response) => {
    try {
      const { packageId } = req.params;
      
      logger.info(`Fetching driver info for package ID: ${packageId}`);
      
      // Validate packageId parameter
      if (!packageId || packageId.trim() === '') {
        logger.warn('Empty or invalid package ID provided');
        return res.status(400).json({ message: 'Package ID is required' });
      }
      
      try {
        // Call delivery service to find the delivery record for this package
        const deliveryServiceUrl = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003';
        const deliveryResponse = await fetch(`${deliveryServiceUrl}/api/deliveries/package/${packageId}`, {
          headers: {
            'Authorization': req.headers.authorization || '',
          }
        });
        
        if (!deliveryResponse.ok) {
          if (deliveryResponse.status === 404) {
            logger.info(`No delivery record found for package ${packageId}`);
            return res.status(404).json({ 
              message: 'No delivery assigned to this package yet',
              packageId: packageId
            });
          }
          throw new Error(`Delivery service responded with status ${deliveryResponse.status}`);
        }
        
        const delivery = await deliveryResponse.json();
        
        if (!delivery.driverId) {
          logger.info(`Package ${packageId} does not have an assigned driver yet`);
          return res.status(404).json({ 
            message: 'No driver assigned to this package yet',
            packageId: packageId
          });
        }
        
        // Now get the driver information
        const driver = await userRepository.findById(delivery.driverId);
        
        if (!driver) {
          logger.warn(`Driver not found with ID: ${delivery.driverId}`);
          return res.status(404).json({ message: 'Driver not found' });
        }
        
        // Verify the user is actually a driver
        if (driver.role !== 'driver') {
          logger.warn(`User ${delivery.driverId} is not a driver, role: ${driver.role}`);
          return res.status(400).json({ message: 'Assigned user is not a driver' });
        }
        
        logger.info(`Successfully found driver: ${driver.name} for package ${packageId}`);
        
        // Return basic driver information (privacy-conscious)
        res.status(200).json({
          id: driver.id,
          name: driver.name,
          email: driver.email,
          role: driver.role,
          status: driver.status,
          createdAt: driver.createdAt,
          packageId: packageId
        });
        
      } catch (serviceError) {
        logger.error('Error communicating with delivery service:', serviceError);
        return res.status(503).json({ 
          message: 'Unable to retrieve delivery information at this time',
          packageId: packageId
        });
      }
      
    } catch (error) {
      logger.error('Get driver info for package error:', error);
      logger.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  },

  getDriverInfo: async (req: Request, res: Response) => {
    try {
      const { driverId } = req.params;
      
      logger.info(`Fetching driver info for ID: ${driverId}`);
      
      // Validate driverId parameter
      if (!driverId || driverId.trim() === '') {
        logger.warn('Empty or invalid driver ID provided');
        return res.status(400).json({ message: 'Driver ID is required' });
      }
      
      // Find the real driver
      const driver = await userRepository.findById(driverId);
      
      if (!driver) {
        logger.warn(`Driver not found with ID: ${driverId}`);
        return res.status(404).json({ message: 'Driver not found' });
      }
      
      // Verify the user is actually a driver
      if (driver.role !== 'driver') {
        logger.warn(`User ${driverId} is not a driver, role: ${driver.role}`);
        return res.status(400).json({ message: 'User is not a driver' });
      }
      
      // Check if driver is active
      if (driver.status !== 'active') {
        logger.warn(`Driver ${driverId} is not active, status: ${driver.status}`);
        return res.status(400).json({ message: 'Driver is not active' });
      }
      
      logger.info(`Successfully found driver: ${driver.name}`);
      
      // Return basic driver information (privacy-conscious)
      res.status(200).json({
        id: driver.id,
        name: driver.name,
        email: driver.email,
        role: driver.role,
        status: driver.status,
        createdAt: driver.createdAt
      });
    } catch (error) {
      logger.error('Get driver info error:', error);
      logger.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  }
};
