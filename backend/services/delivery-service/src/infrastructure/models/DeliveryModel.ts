
import mongoose, { Schema, Document } from 'mongoose';
import { Delivery, DeliveryStatus } from '../../domain/entities/Delivery';

interface DeliveryDocument extends Document, Omit<Delivery, 'id'> {
  // No additional properties needed
}

const deliverySchema = new Schema(
  {
    packageId: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
    },
    ownerId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in transit', 'delivered', 'failed'],
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
    issue: {
      type: String,
    },
    distance: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
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
