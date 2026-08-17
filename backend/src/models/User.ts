import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'CUSTOMER';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  organizationId?: mongoose.Types.ObjectId;
  avatar?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CUSTOMER'],
      default: 'CUSTOMER',
      index: true,
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    avatar: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: true }, // Default to true in dev for smooth workflow
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
