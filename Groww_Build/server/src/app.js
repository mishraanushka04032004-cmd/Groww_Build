import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { sendSuccess } from './utils/response.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import watchlistRoutes from './routes/watchlist.routes.js';
import marketRoutes from './routes/market.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import changeRoutes from './routes/change.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body and cookie parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl !== '/health' && req.originalUrl !== '/api/v1/health') {
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      }, 'Incoming Request');
    }
  });
  next();
});

// Health check endpoints
const handleHealthCheck = (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/v1/health', handleHealthCheck);

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/watchlists', watchlistRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/changes', changeRoutes);
app.use('/api/v1/ai', aiRoutes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
