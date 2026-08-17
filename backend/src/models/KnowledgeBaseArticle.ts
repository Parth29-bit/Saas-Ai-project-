import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBaseArticle extends Document {
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  authorId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeBaseArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: 'General', index: true },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  },
  { timestamps: true }
);

KnowledgeBaseArticleSchema.index({ title: 'text', content: 'text', category: 'text' });

export const KnowledgeBaseArticle = mongoose.model<IKnowledgeBaseArticle>(
  'KnowledgeBaseArticle',
  KnowledgeBaseArticleSchema
);
