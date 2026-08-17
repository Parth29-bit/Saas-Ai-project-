import mongoose, { Schema, Document } from 'mongoose';

export type PlanTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface IAISettings {
  name: string;
  tone: 'Professional' | 'Friendly' | 'Empathic' | 'Concise';
  responseStyle: 'Direct & Quick' | 'Detailed & Explanatory';
  confidenceThreshold: number; // 0 to 100
  autoReplyEnabled: boolean;
}

export interface IOrganization extends Document {
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  supportEmail: string;
  defaultPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  timezone: string;
  plan: PlanTier;
  aiSettings: IAISettings;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, trim: true },
    industry: { type: String, default: 'SaaS' },
    companySize: { type: String, default: '11-50' },
    supportEmail: { type: String, required: true, default: 'support@supportly.ai' },
    defaultPriority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    timezone: { type: String, default: 'UTC' },
    plan: { type: String, enum: ['FREE', 'PRO', 'ENTERPRISE'], default: 'PRO' },
    aiSettings: {
      name: { type: String, default: 'SupportlyBot' },
      tone: { type: String, enum: ['Professional', 'Friendly', 'Empathic', 'Concise'], default: 'Professional' },
      responseStyle: { type: String, enum: ['Direct & Quick', 'Detailed & Explanatory'], default: 'Direct & Quick' },
      confidenceThreshold: { type: Number, default: 85 },
      autoReplyEnabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
