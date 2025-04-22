
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import { logger } from './logger';
import { authMiddleware } from './middlewares/authMiddleware';
import { publicRoutes } from './config/routes';

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
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

// Protected routes
app.use('/api/users', authMiddleware, proxy(USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/users${req.url}`;
  }
}));

app.use('/api/packages', authMiddleware, proxy(PACKAGE_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/packages${req.url}`;
  }
}));

app.use('/api/deliveries', authMiddleware, proxy(DELIVERY_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return `/api/deliveries${req.url}`;
  }
}));

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
