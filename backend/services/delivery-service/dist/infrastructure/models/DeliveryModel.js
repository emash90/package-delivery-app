"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const deliverySchema = new mongoose_1.Schema({
    packageId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    driverId: {
        type: String,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trackingId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'in transit', 'delivered', 'failed'],
        default: 'pending',
        required: true,
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    estimatedDeliveryTime: {
        type: Date,
    },
    actualDeliveryTime: {
        type: Date,
    },
    recipientName: {
        type: String,
        required: true,
    },
    recipientAddress: {
        type: String,
        required: true,
    },
    recipientPhone: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
    issue: {
        type: String,
    },
    distance: {
        type: Number,
    },
    lastUpdate: { type: Date, default: Date.now }
}, {
    timestamps: true,
});
// Map the MongoDB _id to id
deliverySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});
exports.DeliveryModel = mongoose_1.default.model('Delivery', deliverySchema);
