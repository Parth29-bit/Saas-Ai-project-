import { Response, NextFunction } from 'express';
import { Automation } from '../models/Automation';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getAutomations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const automations = await Automation.find({ organizationId: req.user?.organizationId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: automations.length, automations });
  } catch (error) {
    next(error);
  }
};

export const createAutomation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, conditions, actions, isEnabled } = req.body;
    if (!name || !conditions || !actions) {
      throw new AppError('Name, conditions, and actions are required', 400);
    }

    const automation = await Automation.create({
      name,
      description: description || '',
      conditions,
      actions,
      isEnabled: isEnabled !== undefined ? isEnabled : true,
      organizationId: req.user?.organizationId,
    });

    res.status(201).json({ success: true, message: 'Automation rule created', automation });
  } catch (error) {
    next(error);
  }
};

export const toggleAutomation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const automation = await Automation.findById(id);
    if (!automation) throw new AppError('Automation rule not found', 404);

    automation.isEnabled = !automation.isEnabled;
    await automation.save();

    res.status(200).json({ success: true, message: `Automation ${automation.isEnabled ? 'enabled' : 'disabled'}`, automation });
  } catch (error) {
    next(error);
  }
};

export const deleteAutomation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Automation.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Automation deleted' });
  } catch (error) {
    next(error);
  }
};
