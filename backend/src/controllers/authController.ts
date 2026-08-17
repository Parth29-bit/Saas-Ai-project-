import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Organization } from '../models/Organization';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'supportly_ai_super_secret_jwt_key_2026_change_in_production';

const sendTokenResponse = (user: IUser, statusCode: number, res: Response, message: string) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.cookie('token', token, cookieOptions);

  const userJson = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userJson,
  });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, companyName } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email address already exists', 400);
    }

    const name = `${firstName || 'User'} ${lastName || ''}`.trim();
    const org = await Organization.create({
      name: companyName || `${name}'s Company`,
      supportEmail: email,
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'ADMIN',
      organizationId: org._id,
      isEmailVerified: true,
    });

    sendTokenResponse(user, 201, res, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide an email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid credentials. User not found.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        organizationId: req.user.organizationId,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  res.status(200).json({
    success: true,
    message: `If an account with email ${email} exists, a password reset link has been dispatched.`,
    resetToken: 'demo_reset_token_123',
  });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password } = req.body;
    if (!password) throw new AppError('New password is required', 400);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const demoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    const targetRole = (role || 'ADMIN').toUpperCase();

    let user = await User.findOne({ role: targetRole });
    if (!user) {
      user = await User.findOne();
    }

    if (!user) {
      throw new AppError('No seed user found. Please run seed script.', 404);
    }

    sendTokenResponse(user, 200, res, `Switched role to ${targetRole}`);
  } catch (error) {
    next(error);
  }
};
