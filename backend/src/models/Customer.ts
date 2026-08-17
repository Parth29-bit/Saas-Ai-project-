import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  tags: string[];
  lifetimeValue: number;
  satisfactionScore: number; // e.g. 4.8 out of 5
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    company: { type: String, default: 'Independent' },
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes: { type: String, default: '' },
    tags: [{ type: String }],
    lifetimeValue: { type: Number, default: 0 },
    satisfactionScore: { type: Number, default: 5.0 },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
