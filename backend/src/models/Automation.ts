import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationCondition {
  field: 'priority' | 'sentiment' | 'contains_text' | 'category' | 'customer_tier';
  operator: 'equals' | 'contains' | 'greater_than';
  value: string;
}

export interface IAutomationAction {
  type: 'assign_agent' | 'set_priority' | 'set_category' | 'add_tag' | 'send_internal_note';
  value: string;
}

export interface IAutomation extends Document {
  name: string;
  description?: string;
  isEnabled: boolean;
  conditions: IAutomationCondition[];
  actions: IAutomationAction[];
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true, index: true },
    conditions: [
      {
        field: { type: String, required: true },
        operator: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    actions: [
      {
        type: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  },
  { timestamps: true }
);

export const Automation = mongoose.model<IAutomation>('Automation', AutomationSchema);
