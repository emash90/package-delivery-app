"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./infrastructure/logger");
const userRoutes_1 = require("./interface/routes/userRoutes");
const messageBroker_1 = require("./infrastructure/messageBroker");
const app = (0, express_1.default)();
require('dotenv').config();
const PORT = process.env.USER_SERVICE_PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/packaroo';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB...');
})
    .catch((error) => {
    logger_1.logger.error('MongoDB connection error:', error);
    process.exit(1);
});
// Setup message broker
(0, messageBroker_1.setupMessageBroker)().catch(error => {
    logger_1.logger.error('RabbitMQ connection error:', error);
    process.exit(1);
});
// Routes
app.use('/api/users', userRoutes_1.userRouter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'User service is running!!!' });
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`User service running on port ${PORT}`);
});
