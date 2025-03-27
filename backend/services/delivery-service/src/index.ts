
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { logger } from './infrastructure/logger';
import { deliveryRoutes as deliveryRouter } from './interface/routes/deliveryRoutes';
import { setupMessageBroker } from './infrastructure/messageBroker';

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3003;

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
  logger.error('RabbitMQ connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/deliveries', deliveryRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Delivery service is running' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Delivery service running on port ${PORT}`);
});
