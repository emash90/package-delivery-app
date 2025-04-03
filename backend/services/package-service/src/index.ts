
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { logger } from './infrastructure/logger';
import { packageRouter } from './interface/routes/packageRoutes';
import { setupMessageBroker } from './infrastructure/messageBroker';

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/packaroo';
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Setup message broker
setupMessageBroker().catch(error => {
  logger.error('RabbitMQ connection error...', error);
  process.exit(1);
});

// Routes
app.use('/api/packages', packageRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Package service is running' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Package service running on port ${PORT}`);
});
