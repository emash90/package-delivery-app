import mongoose, { Schema, Document } from 'mongoose';
import { PackageStatus } from '../../domain/entities/Package';

export interface PackageDocument extends Document {
  name: string;
  description: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  userId: mongoose.Schema.Types.ObjectId;
  recipientName: string;
  recipientContact: string;
  status: PackageStatus;
  location?: string;
  trackingId: string;
  eta?: Date;
  category?: string;
  images?: string[];
  lastUpdate: Date;
}

const PackageSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: {
      width: { type: Number, required: false },
      height: { type: Number, required: false },
      length: { type: Number, required: false }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true },
    recipientContact: { type: String, required: true },
    status: {
      type: String,
      enum: ['processing', 'in transit', 'delivered', 'cancelled'],
      default: 'processing'
    },
    location: { type: String },
    trackingId: { type: String, required: true, unique: true },
    eta: { type: Date },
    category: { type: String },
    images: [{ type: String }],
    lastUpdate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const PackageModel = mongoose.model<PackageDocument>('Package', PackageSchema);
