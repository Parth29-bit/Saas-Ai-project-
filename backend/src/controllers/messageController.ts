import { Response, NextFunction } from 'express';
import { Message } from '../models/Message';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const addMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ticketId, message, isInternalNote, attachments } = req.body;

    if (!ticketId || !message) {
      throw new AppError('ticketId and message text are required', 400);
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const newMessage = await Message.create({
      ticketId,
      senderId: req.user?._id,
      senderRole: req.user?.role || 'CUSTOMER',
      message,
      isInternalNote: !!isInternalNote,
      attachments: attachments || [],
    });

    // Update ticket status based on sender role
    if (!isInternalNote) {
      if (req.user?.role === 'CUSTOMER') {
        ticket.status = 'IN_PROGRESS';
      } else {
        ticket.status = 'WAITING_ON_CUSTOMER';
      }
      await ticket.save();
    }

    const populated = await Message.findById(newMessage._id).populate('senderId', 'name email avatar role');

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};
