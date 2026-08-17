import mongoose, { Schema, Document } from 'mongoose';

export type TicketStatus = 'NEW' | 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED';

export interface ITicket extends Document {
  ticketNumber: string; // e.g. SUP-1001
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  tags: string[];
  channel: 'PORTAL' | 'CHAT' | 'EMAIL' | 'API';
  customerId: mongoose.Types.ObjectId;
  assignedAgentId?: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  sentiment: TicketSentiment;
  urgencyScore: number; // 1 to 10
  aiSummary?: string;
  slaResponseDue: Date;
  csatRating?: number; // 1 to 5 stars
  csatFeedback?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'OPEN', 'PENDING', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      index: true,
    },
    category: { type: String, default: 'General', index: true },
    tags: [{ type: String }],
    channel: { type: String, enum: ['PORTAL', 'CHAT', 'EMAIL', 'API'], default: 'PORTAL' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'FRUSTRATED'],
      default: 'NEUTRAL',
    },
    urgencyScore: { type: Number, default: 5 },
    aiSummary: { type: String },
    slaResponseDue: { type: Date, required: true },
    csatRating: { type: Number, min: 1, max: 5 },
    csatFeedback: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
