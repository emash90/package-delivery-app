
import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  }
];

export const validateRegister = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  check('role')
    .isIn(['owner', 'driver', 'admin'])
    .withMessage('Role must be owner, driver, or admin'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  }
];
