
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { logger } from './infrastructure/logger';
import { userRouter } from './interface/routes/userRoutes';
import { setupMessageBroker } from './infrastructure/messageBroker';
import { seedDatabase } from './infrastructure/database/seed';

const app = express();

require('dotenv').config();

const PORT = process.env.USER_SERVICE_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/packaroo';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    logger.info('Connected to MongoDB...');
    
    // Run database seeding
    try {
      await seedDatabase();
      logger.info('Database seeding completed');
    } catch (error) {
      logger.warn('Database seeding failed:', error);
      // Don't exit - seeding failure shouldn't stop the service
    }
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Setup message broker
setupMessageBroker().catch(error => {
  logger.error('RabbitMQ connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'User service is running!!!' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`User service running on port ${PORT}`);
});
