import mongoose, { Schema, Document } from 'mongoose';
import { Permission } from '../../domain/entities/Permission';

export type PermissionDocument = Permission & Document;

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    resource: { type: String, required: true },
    action: { type: String, required: true }
  },
  { timestamps: true }
);

PermissionSchema.index({ resource: 1, action: 1 }, { unique: true });

export const PermissionModel = mongoose.model<PermissionDocument>('Permission', PermissionSchema);