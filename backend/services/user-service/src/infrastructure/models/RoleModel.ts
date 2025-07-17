import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../../domain/entities/Role';

export type RoleDocument = Role & Document;

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const RoleModel = mongoose.model<RoleDocument>('Role', RoleSchema);