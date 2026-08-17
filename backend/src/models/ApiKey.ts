import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
  name: string;
  prefix: string;
  keyHash: string;
  permissions: string[];
  lastUsedAt?: Date;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ApiKeySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    prefix: { type: String, required: true },
    keyHash: { type: String, required: true, select: false },
    permissions: [{ type: String, default: 'read:write' }],
    lastUsedAt: { type: Date },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
