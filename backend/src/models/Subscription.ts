import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  organizationId: mongoose.Types.ObjectId;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  stripeCustomerId?: string;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    plan: { type: String, enum: ['FREE', 'PRO', 'ENTERPRISE'], default: 'PRO' },
    status: { type: String, enum: ['active', 'past_due', 'canceled', 'trialing'], default: 'active' },
    stripeCustomerId: { type: String, default: '' },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
