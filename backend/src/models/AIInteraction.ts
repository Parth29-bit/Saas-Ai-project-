import mongoose, { Schema, Document } from 'mongoose';

export interface IAIInteraction extends Document {
  ticketId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  prompt: string;
  completion: string;
  aiModel: string;
  confidenceScore: number;
  tokensUsed: number;
  actionType: 'SMART_REPLY' | 'SUMMARIZE' | 'SENTIMENT' | 'CHATBOT' | 'REWRITE';
  createdAt: Date;
  updatedAt: Date;
}

const AIInteractionSchema: Schema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    prompt: { type: String, required: true },
    completion: { type: String, required: true },
    aiModel: { type: String, default: 'gemini-1.5-flash' },
    confidenceScore: { type: Number, default: 90 },
    tokensUsed: { type: Number, default: 150 },
    actionType: {
      type: String,
      enum: ['SMART_REPLY', 'SUMMARIZE', 'SENTIMENT', 'CHATBOT', 'REWRITE'],
      required: true,
    },
  },
  { timestamps: true }
);

export const AIInteraction = mongoose.model<IAIInteraction>('AIInteraction', AIInteractionSchema);
