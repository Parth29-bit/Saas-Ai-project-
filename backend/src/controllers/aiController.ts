import { Response, NextFunction } from 'express';
import { AIService } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';
import { AIInteraction } from '../models/AIInteraction';

export const generateReply = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ticketSubject, messageHistory, ticketId } = req.body;
    const orgId = req.user?.organizationId?.toString();

    const response = await AIService.generateReply(
      ticketSubject || 'General Support Inquiry',
      messageHistory || 'Customer requires assistance.',
      orgId
    );

    if (orgId) {
      await AIInteraction.create({
        ticketId,
        userId: req.user?._id,
        organizationId: req.user?.organizationId,
        prompt: `Ticket Subject: ${ticketSubject}`,
        completion: response.content,
        aiModel: 'gemini-1.5-flash',
        confidenceScore: response.confidenceScore,
        tokensUsed: response.tokensUsed,
        actionType: 'SMART_REPLY',
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const summarizeTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { conversationText } = req.body;
    const response = await AIService.summarizeTicket(conversationText || '');

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeSentiment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text } = req.body;
    const analysis = await AIService.analyzeSentiment(text || '');

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const customerChat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query } = req.body;
    const orgId = req.user?.organizationId?.toString();

    const response = await AIService.customerChat(query || '', orgId);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const rewriteText = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, mode, targetLang } = req.body;
    const response = await AIService.rewriteText(text || '', mode || 'professional', targetLang);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
