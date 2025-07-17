
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
  }
};
