import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getTeamMembers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const members = await User.find({
      organizationId: req.user?.organizationId,
      role: { $in: ['ADMIN', 'AGENT'] },
    }).sort({ createdAt: -1 });

    const formatted = await Promise.all(
      members.map(async (m) => {
        const assignedTickets = await Ticket.countDocuments({ assignedAgentId: m._id, status: { $ne: 'RESOLVED' } });
        const resolvedTickets = await Ticket.countDocuments({ assignedAgentId: m._id, status: 'RESOLVED' });

        return {
          ...m.toObject(),
          assignedTickets,
          resolvedTickets,
          avgResponseTime: '12m',
          csat: 4.9,
        };
      })
    );

    res.status(200).json({ success: true, count: formatted.length, members: formatted });
  } catch (error) {
    next(error);
  }
};

export const inviteTeamMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) throw new AppError('Name and email are required', 400);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new AppError('User with this email already exists', 400);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt); // Default dev password

    const newMember = await User.create({
      name,
      email: email.toLowerCase(),
      role: role || 'AGENT',
      passwordHash,
      organizationId: req.user?.organizationId,
    });

    res.status(201).json({ success: true, message: `Invited ${name} to team`, member: newMember });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) throw new AppError('Team member not found', 404);

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: 'Role updated successfully', user });
  } catch (error) {
    next(error);
  }
};
