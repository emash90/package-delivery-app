
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import { logger } from './logger';
import { authMiddleware } from './middlewares/authMiddleware';
import { enrichUserWithPermissions, requirePermission, requireAnyPermission } from './middlewares/rbacMiddleware';
import { publicRoutes } from './config/routes';
import { PERMISSIONS, ROUTE_PERMISSIONS } from './config/permissions';

require('dotenv').config();


const app = express();
const PORT = process.env.GATEWAY_PORT || 4000;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(helmet());
app.use(express.json());

// Health check
app.get('/health_check', (req, res) => {
  res.status(200).json({ status: 'API Gateway is running' });
});

// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PACKAGE_SERVICE_URL = process.env.PACKAGE_SERVICE_URL || 'http://localhost:3002';
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003';

// Public routes (no auth required)
publicRoutes.forEach(route => {
  app.use(route.path, proxy(route.serviceUrl, {
    proxyReqPathResolver: (req) => {
      return `${route.prefix}${req.url}`;
    }
  }));
});

// User service routes
app.use('/api/auth', proxy(USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/users${req.url}`;
  }
}));

// Protected routes with centralized RBAC
app.use('/api/users', enrichUserWithPermissions, proxy(USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/users${req.url}`;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward user info to downstream services
    const user = (srcReq as any).user;
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

app.use('/api/packages', enrichUserWithPermissions, proxy(PACKAGE_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/packages${req.url}`;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward user info to downstream services
    const user = (srcReq as any).user;
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

app.use('/api/deliveries', enrichUserWithPermissions, proxy(DELIVERY_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/deliveries${req.url}`;
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Forward user info to downstream services
    const user = (srcReq as any).user;
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
  logger.info(`API Gateway running on port ${PORT}`);
});
