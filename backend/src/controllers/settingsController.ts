import { Response, NextFunction } from 'express';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const org = await Organization.findById(req.user?.organizationId);
    res.status(200).json({
      success: true,
      organization: org,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrgSettings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, industry, companySize, supportEmail, aiSettings } = req.body;
    const org = await Organization.findById(req.user?.organizationId);

    if (!org) throw new AppError('Organization not found', 404);

    if (name) org.name = name;
    if (industry) org.industry = industry;
    if (companySize) org.companySize = companySize;
    if (supportEmail) org.supportEmail = supportEmail;
    if (aiSettings) org.aiSettings = { ...org.aiSettings, ...aiSettings };

    await org.save();

    res.status(200).json({ success: true, message: 'Settings updated successfully', organization: org });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, avatar } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) throw new AppError('User not found', 404);

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};
