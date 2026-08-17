import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'NEW_TICKET'
  | 'ASSIGNMENT'
  | 'REPLY'
  | 'ESCALATION'
  | 'MENTION'
  | 'AI_SUGGESTION'
  | 'SLA_WARNING';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['NEW_TICKET', 'ASSIGNMENT', 'REPLY', 'ESCALATION', 'MENTION', 'AI_SUGGESTION', 'SLA_WARNING'],
      required: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
