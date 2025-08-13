"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./infrastructure/logger");
const packageRoutes_1 = require("./interface/routes/packageRoutes");
const messageBroker_1 = require("./infrastructure/messageBroker");
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = process.env.PACKAGE_SERVICE_PORT || 3002;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/packaroo';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB');
})
    .catch((error) => {
    logger_1.logger.error('MongoDB connection error:', error);
    process.exit(1);
});
// Setup message broker
(0, messageBroker_1.setupMessageBroker)().catch(error => {
    logger_1.logger.error('RabbitMQ connection error', error);
    process.exit(1);
});
// Routes
app.use('/api/packages', packageRoutes_1.packageRouter);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Package service is running...' });
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`Package service running on port ${PORT}`);
});
