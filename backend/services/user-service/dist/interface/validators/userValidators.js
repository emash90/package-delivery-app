"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.check)('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .withMessage('Password is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
exports.validateRegister = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.check)('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.check)('role')
        .isIn(['owner', 'driver', 'admin'])
        .withMessage('Role must be owner, driver, or admin'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
