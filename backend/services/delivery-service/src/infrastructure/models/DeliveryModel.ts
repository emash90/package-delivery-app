
import mongoose, { Schema, Document } from 'mongoose';
import { Delivery, DeliveryStatus } from '../../domain/entities/Delivery';

interface DeliveryDocument extends Document, Omit<Delivery, 'id'> {
  // No additional properties needed
}

const deliverySchema = new Schema(
  {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    driverId: {
      type: String,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

// Map the MongoDB _id to id
deliverySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export const DeliveryModel = mongoose.model<DeliveryDocument>('Delivery', deliverySchema);
