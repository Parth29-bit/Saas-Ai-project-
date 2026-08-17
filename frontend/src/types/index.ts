export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'CUSTOMER';
export type TicketStatus = 'NEW' | 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  avatar?: string;
  isEmailVerified: boolean;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  tags: string[];
  channel: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    company?: string;
    lifetimeValue?: number;
    satisfactionScore?: number;
  };
  assignedAgentId?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: UserRole;
  };
  organizationId: string;
  sentiment: TicketSentiment;
  urgencyScore: number;
  aiSummary?: string;
  slaResponseDue: string;
  csatRating?: number;
  csatFeedback?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  ticketId: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
  };
  senderRole: UserRole;
  message: string;
  isInternalNote: boolean;
  aiGenerated: boolean;
  attachments?: { name: string; url: string; size?: string }[];
  createdAt: string;
}

export interface CustomerProfile {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  tags: string[];
  lifetimeValue: number;
  satisfactionScore: number;
  ticketCount?: number;
  lastInteraction?: string;
  createdAt: string;
}

export interface KnowledgeArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  views: number;
  helpfulVotes: number;
  authorId?: { name: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AutomationRule {
  _id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  conditions: { field: string; operator: string; value: string }[];
  actions: { type: string; value: string }[];
  createdAt: string;
}
