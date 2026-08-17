import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Ticket } from '../models/Ticket';
import { Message } from '../models/Message';
import { KnowledgeBaseArticle } from '../models/KnowledgeBaseArticle';
import { Automation } from '../models/Automation';
import { Notification } from '../models/Notification';

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Ticket.deleteMany({});
    await Message.deleteMany({});
    await KnowledgeBaseArticle.deleteMany({});
    await Automation.deleteMany({});
    await Notification.deleteMany({});

    console.log('🏢 Creating Demo Organization...');
    const org = await Organization.create({
      name: 'Acme SaaS Corp',
      domain: 'acmesaas.com',
      industry: 'Software & Technology',
      companySize: '51-200',
      supportEmail: 'support@acmesaas.com',
      defaultPriority: 'MEDIUM',
      timezone: 'UTC',
      plan: 'ENTERPRISE',
      aiSettings: {
        name: 'SupportlyBot AI',
        tone: 'Professional',
        responseStyle: 'Direct & Quick',
        confidenceThreshold: 88,
        autoReplyEnabled: true,
      },
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    console.log('👥 Creating Demo Users & Roles...');
    const admin = await User.create({
      name: 'Alex Rivera (Admin)',
      email: 'admin@supportly.ai',
      passwordHash,
      role: 'ADMIN',
      organizationId: org._id,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const agent1 = await User.create({
      name: 'Jordan Lee (Senior Support Agent)',
      email: 'agent@supportly.ai',
      passwordHash,
      role: 'AGENT',
      organizationId: org._id,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const agent2 = await User.create({
      name: 'Sarah Chen (Tier 2 Engineer)',
      email: 'sarah.agent@supportly.ai',
      passwordHash,
      role: 'AGENT',
      organizationId: org._id,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const customerUser = await User.create({
      name: 'David Vance (Customer)',
      email: 'customer@supportly.ai',
      passwordHash,
      role: 'CUSTOMER',
      organizationId: org._id,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });

    console.log('🏢 Creating Customer Profiles...');
    const customerProfile = await Customer.create({
      userId: customerUser._id,
      name: 'David Vance',
      email: 'customer@supportly.ai',
      company: 'TechFlow Global',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      notes: 'VIP Customer. High monthly API volume. Requests rapid response times.',
      tags: ['VIP', 'Enterprise', 'High MRR'],
      lifetimeValue: 18500,
      satisfactionScore: 4.9,
      organizationId: org._id,
    });

    console.log('📚 Seeding Knowledge Base Articles...');
    const kb1 = await KnowledgeBaseArticle.create({
      title: 'How to Reset Your API Key and Manage Webhook Permissions',
      slug: 'how-to-reset-api-key',
      content: `To generate or revoke API keys in Supportly AI:
1. Navigate to Settings > Developer & API Keys.
2. Click "Generate New Secret Key".
3. Copy your bearer token immediately. Secret tokens are never shown again after generation for safety.
4. Ensure your webhook endpoint returns HTTP 200 OK within 3000ms.`,
      category: 'Technical & API',
      tags: ['api', 'security', 'webhooks'],
      isPublished: true,
      views: 342,
      helpfulVotes: 29,
      authorId: admin._id,
      organizationId: org._id,
    });

    const kb2 = await KnowledgeBaseArticle.create({
      title: 'Understanding Billing Cycles, Upgrades, and Invoice History',
      slug: 'billing-cycles-and-upgrades',
      content: `Supportly AI bills on a monthly or annual subscription schedule:
• Upgrades take effect immediately with pro-rated billing adjustments.
• Failed credit card charges trigger a 3-day grace period before account suspension.
• Download PDF invoices anytime from Settings > Billing.`,
      category: 'Billing & Account',
      tags: ['billing', 'invoices', 'subscriptions'],
      isPublished: true,
      views: 512,
      helpfulVotes: 48,
      authorId: admin._id,
      organizationId: org._id,
    });

    console.log('🎫 Creating Realistic Tickets & Conversations...');
    const ticket1 = await Ticket.create({
      ticketNumber: 'SUP-1084',
      subject: 'Webhook integration returning HTTP 500 error during high traffic',
      description: 'Our API integration endpoint stopped receiving webhook notifications around 10:00 AM UTC. Error logs show 500 Internal Error.',
      status: 'OPEN',
      priority: 'URGENT',
      category: 'Technical & API',
      tags: ['api', 'webhooks', 'sla-priority'],
      channel: 'PORTAL',
      customerId: customerUser._id,
      assignedAgentId: agent1._id,
      organizationId: org._id,
      sentiment: 'FRUSTRATED',
      urgencyScore: 9,
      aiSummary: 'Customer experiencing API webhook failures on production endpoint. Urgent SLA priority assigned.',
      slaResponseDue: new Date(Date.now() + 1 * 60 * 60 * 1000), // Due in 1 hour
    });

    await Message.create({
      ticketId: ticket1._id,
      senderId: customerUser._id,
      senderRole: 'CUSTOMER',
      message: 'Our API integration endpoint stopped receiving webhook notifications around 10:00 AM UTC. Error logs show 500 Internal Error.',
    });

    await Message.create({
      ticketId: ticket1._id,
      senderId: agent1._id,
      senderRole: 'AGENT',
      message: `⚡ [AI Copilot Suggested Draft Applied]
Hello David, thanks for reporting this! Our engineering team monitored a brief rate spike between 10:00 - 10:15 AM UTC. We have automatically retried the failed event queue. Could you confirm if webhook receipts have normalized?`,
      aiGenerated: true,
    });

    await Message.create({
      ticketId: ticket1._id,
      senderId: agent1._id,
      senderRole: 'AGENT',
      message: '🔒 Note for Sarah: Checked event bus logs. Looks like worker node #4 lost connection briefly. Node restarted.',
      isInternalNote: true,
    });

    const ticket2 = await Ticket.create({
      ticketNumber: 'SUP-1085',
      subject: 'Request for annual plan invoice receipt for accounting audit',
      description: 'Hi team, could you send the PDF receipt for our recent annual Pro plan renewal? Need it for our tax audit.',
      status: 'RESOLVED',
      priority: 'LOW',
      category: 'Billing & Account',
      tags: ['billing', 'invoice'],
      channel: 'EMAIL',
      customerId: customerUser._id,
      assignedAgentId: agent2._id,
      organizationId: org._id,
      sentiment: 'POSITIVE',
      urgencyScore: 3,
      aiSummary: 'Customer requested annual invoice receipt for accounting audit. Resolved with attached PDF.',
      slaResponseDue: new Date(Date.now() + 24 * 60 * 60 * 1000),
      csatRating: 5,
      csatFeedback: 'Super fast response! Got my invoice in 5 minutes.',
      resolvedAt: new Date(),
    });

    await Message.create({
      ticketId: ticket2._id,
      senderId: customerUser._id,
      senderRole: 'CUSTOMER',
      message: 'Hi team, could you send the PDF receipt for our recent annual Pro plan renewal?',
    });

    await Message.create({
      ticketId: ticket2._id,
      senderId: agent2._id,
      senderRole: 'AGENT',
      message: 'Hello David! Attached is your official PDF invoice for the annual Pro subscription. Have a great day!',
    });

    console.log('🤖 Creating Automations & Notifications...');
    await Automation.create({
      name: 'Auto-Assign Urgent Tickets to Senior Agents',
      description: 'Triggers when priority is Urgent to ensure fast SLA response.',
      isEnabled: true,
      conditions: [{ field: 'priority', operator: 'equals', value: 'URGENT' }],
      actions: [{ type: 'assign_agent', value: 'agent@supportly.ai' }],
      organizationId: org._id,
    });

    await Notification.create({
      userId: agent1._id,
      title: 'Urgent Ticket Assigned',
      message: 'Ticket SUP-1084 (Webhook HTTP 500) assigned to you.',
      type: 'ASSIGNMENT',
      link: '/agent/tickets/SUP-1084',
    });

    console.log('✅ Database Seed Completed Successfully!');
    console.log(`
-------------------------------------------------------
🔑 DEMO USER CREDENTIALS FOR TESTING:
-------------------------------------------------------
👑 Admin User:    admin@supportly.ai    / password123
🎧 Agent User:    agent@supportly.ai    / password123
👤 Customer User: customer@supportly.ai / password123
-------------------------------------------------------
`);

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
