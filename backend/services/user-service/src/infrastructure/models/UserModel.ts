
import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../domain/entities/User';

export type UserDocument = User & Document;


const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      enum: ['owner', 'driver', 'admin'], 
      default: 'owner' 
    },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
