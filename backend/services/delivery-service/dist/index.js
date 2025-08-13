"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./infrastructure/logger");
const deliveryRoutes_1 = require("./interface/routes/deliveryRoutes");
const messageBroker_1 = require("./infrastructure/messageBroker");
const DeliveryRepository_1 = require("./infrastructure/repositories/DeliveryRepository");
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = process.env.DELIVERY_SERVICE_PORT || 3003;
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
async function startDeliveryService() {
    const deliveryRepo = new DeliveryRepository_1.DeliveryRepository();
    await (0, messageBroker_1.setupMessageBroker)(deliveryRepo);
    logger_1.logger.info('Delivery service started');
}
startDeliveryService();
// Routes
app.use('/api/deliveries', deliveryRoutes_1.deliveryRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Delivery service is running' });
});
// Start server
app.listen(PORT, () => {
    logger_1.logger.info(`Delivery service running on port ${PORT}`);
});
