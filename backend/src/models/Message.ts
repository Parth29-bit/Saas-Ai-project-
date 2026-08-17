import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: UserRole;
  message: string;
  isInternalNote: boolean;
  aiGenerated: boolean;
  attachments: { name: string; url: string; size?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'CUSTOMER'], required: true },
    message: { type: String, required: true },
    isInternalNote: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        size: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
