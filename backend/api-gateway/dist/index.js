"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const logger_1 = require("./logger");
const rbacMiddleware_1 = require("./middlewares/rbacMiddleware");
const routes_1 = require("./config/routes");
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = process.env.GATEWAY_PORT || 4000;
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/health_check', (req, res) => {
    res.status(200).json({ status: 'API Gateway is running' });
});
// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PACKAGE_SERVICE_URL = process.env.PACKAGE_SERVICE_URL || 'http://localhost:3002';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003';
// Public routes (no auth required)
routes_1.publicRoutes.forEach(route => {
    app.use(route.path, (0, express_http_proxy_1.default)(route.serviceUrl, {
        proxyReqPathResolver: (req) => {
            return `${route.prefix}${req.url}`;
        }
    }));
});
// User service routes
app.use('/api/auth', (0, express_http_proxy_1.default)(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/api/users${req.url}`;
    }
}));
// Protected routes with centralized RBAC
app.use('/api/users', rbacMiddleware_1.enrichUserWithPermissions, (0, express_http_proxy_1.default)(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/api/users${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Forward user info to downstream services
        const user = srcReq.user;
        if (user) {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            proxyReqOpts.headers['x-user-id'] = user.id;
            proxyReqOpts.headers['x-user-email'] = user.email;
            proxyReqOpts.headers['x-user-role'] = user.role;
            proxyReqOpts.headers['x-user-permissions'] = JSON.stringify(user.permissions || []);
        }
        return proxyReqOpts;
    }
}));
app.use('/api/packages', rbacMiddleware_1.enrichUserWithPermissions, (0, express_http_proxy_1.default)(PACKAGE_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/api/packages${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Forward user info to downstream services
        const user = srcReq.user;
        if (user) {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            proxyReqOpts.headers['x-user-id'] = user.id;
            proxyReqOpts.headers['x-user-email'] = user.email;
            proxyReqOpts.headers['x-user-role'] = user.role;
            proxyReqOpts.headers['x-user-permissions'] = JSON.stringify(user.permissions || []);
        }
        return proxyReqOpts;
    }
}));
app.use('/api/deliveries', rbacMiddleware_1.enrichUserWithPermissions, (0, express_http_proxy_1.default)(DELIVERY_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/api/deliveries${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Forward user info to downstream services
        const user = srcReq.user;
        if (user) {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            proxyReqOpts.headers['x-user-id'] = user.id;
            proxyReqOpts.headers['x-user-email'] = user.email;
            proxyReqOpts.headers['x-user-role'] = user.role;
            proxyReqOpts.headers['x-user-permissions'] = JSON.stringify(user.permissions || []);
        }
        return proxyReqOpts;
    }
}));
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`API Gateway running on port ${PORT}`);
});
