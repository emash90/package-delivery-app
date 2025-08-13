"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoutes = void 0;
// Define public routes that don't require authentication
exports.publicRoutes = [
    {
        path: '/api/track',
        serviceUrl: process.env.PACKAGE_SERVICE_URL || 'http://localhost:3002',
        prefix: '/api/packages/track'
    },
    {
        path: '/api/auth/login',
        serviceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
        prefix: '/api/users/login'
    },
    {
        path: '/api/auth/register',
        serviceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
        prefix: '/api/users/register'
    }
];
