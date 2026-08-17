import { Response, NextFunction } from 'express';
import { Ticket } from '../models/Ticket';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { AIService } from '../services/aiService';
import { AutomationService } from '../services/automationService';

export const getTickets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, category, queue, search, limit = 50, page = 1 } = req.query;
    const filter: any = {};

    if (req.user?.role === 'CUSTOMER') {
      filter.customerId = req.user._id;
    } else if (req.user?.organizationId) {
      filter.organizationId = req.user.organizationId;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (queue === 'unassigned') {
      filter.assignedAgentId = { $exists: false };
    } else if (queue === 'mine' && req.user) {
      filter.assignedAgentId = req.user._id;
    } else if (queue === 'urgent') {
      filter.priority = 'URGENT';
    } else if (queue === 'resolved') {
      filter.status = 'RESOLVED';
    }

    if (search) {
      filter.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const tickets = await Ticket.find(filter)
      .populate('customerId', 'name email avatar company')
      .populate('assignedAgentId', 'name email avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Ticket.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('customerId', 'name email avatar company lifetimeValue satisfactionScore')
      .populate('assignedAgentId', 'name email avatar role');

    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const messages = await Message.find({ ticketId: ticket._id })
      .populate('senderId', 'name email avatar role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      ticket,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject, description, category, priority, channel } = req.body;

    if (!subject || !description) {
      throw new AppError('Subject and description are required', 400);
    }

    const customerId = req.user?._id;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      throw new AppError('User must belong to an organization to create a ticket', 400);
    }

    // Generate unique Ticket Number SUP-XXXX
    const count = await Ticket.countDocuments();
    const ticketNumber = `SUP-${1000 + count + 1}`;

    // Calculate SLA due date (Default: 4 hours from now)
    const slaResponseDue = new Date(Date.now() + 4 * 60 * 60 * 1000);

    // AI Triage & Sentiment Analysis
    const aiAnalysis = await AIService.analyzeSentiment(`${subject} ${description}`);

    const ticket = await Ticket.create({
      ticketNumber,
      subject,
      description,
      status: 'OPEN',
      priority: priority || aiAnalysis.suggestedPriority,
      category: category || aiAnalysis.suggestedCategory,
      channel: channel || 'PORTAL',
      customerId,
      organizationId,
      sentiment: aiAnalysis.sentiment,
      urgencyScore: aiAnalysis.urgencyScore,
      slaResponseDue,
      tags: ['new-inquiry'],
    });

    // Create initial message in thread
    await Message.create({
      ticketId: ticket._id,
      senderId: customerId,
      senderRole: req.user?.role || 'CUSTOMER',
      message: description,
      isInternalNote: false,
    });

    // Run Automations Engine
    await AutomationService.processTicketAutomations(ticket);

    const populatedTicket = await Ticket.findById(ticket._id).populate('customerId', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: populatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, priority, category, tags, assignedAgentId, csatRating, csatFeedback } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;
    if (tags) ticket.tags = tags;
    if (assignedAgentId !== undefined) ticket.assignedAgentId = assignedAgentId || undefined;
    if (csatRating) ticket.csatRating = csatRating;
    if (csatFeedback) ticket.csatFeedback = csatFeedback;

    if (status === 'RESOLVED' && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    const updated = await Ticket.findById(id)
      .populate('customerId', 'name email avatar')
      .populate('assignedAgentId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Ticket.findByIdAndDelete(id);
    await Message.deleteMany({ ticketId: id });

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
