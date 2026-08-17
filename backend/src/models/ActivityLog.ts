import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  action: string;
  entityType: 'TICKET' | 'CUSTOMER' | 'USER' | 'KB_ARTICLE' | 'AUTOMATION' | 'ORGANIZATION';
  entityId?: string;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ['TICKET', 'CUSTOMER', 'USER', 'KB_ARTICLE', 'AUTOMATION', 'ORGANIZATION'],
      required: true,
    },
    entityId: { type: String },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
