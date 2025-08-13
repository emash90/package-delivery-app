"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const TokenService_1 = require("../../infrastructure/services/TokenService");
const tokenService = new TokenService_1.TokenService();
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
        const token = authHeader.split(' ')[1];
        const payload = tokenService.verifyToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
