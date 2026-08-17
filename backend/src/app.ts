import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';
import messageRoutes from './routes/messageRoutes';
import customerRoutes from './routes/customerRoutes';
import kbRoutes from './routes/kbRoutes';
import aiRoutes from './routes/aiRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import automationRoutes from './routes/automationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import teamRoutes from './routes/teamRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Healthcheck
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'Supportly AI API', timestamp: new Date().toISOString() });
});

// REST API V1 Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/kb', kbRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/automations', automationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Fallback 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
