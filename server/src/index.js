import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhooks.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Determine allowed CORS origins
const getAllowedOrigins = () => {
  if (NODE_ENV === 'production') {
    // In production, specify exact frontend URL
    return [
      process.env.FRONTEND_URL || 'https://your-app.vercel.app'
    ];
  }
  // Development: allow localhost on any port
  return ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
};

// Middleware
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware (development only)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend server is healthy',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/webhook', webhookRoutes);

// Redirect legacy endpoints to new structure
app.post('/api/social-media', (req, res, next) => {
  req.url = '/api/webhook/social-media';
  webhookRoutes(req, res, next);
});

app.post('/api/podcast', (req, res, next) => {
  req.url = '/api/webhook/podcast';
  webhookRoutes(req, res, next);
});

app.post('/api/thumbnail', (req, res, next) => {
  req.url = '/api/webhook/thumbnail';
  webhookRoutes(req, res, next);
});

// 404 handler (must be after all other routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       AI Studio Backend Server         ║
╚════════════════════════════════════════╝
Environment: ${NODE_ENV}
Port: ${PORT}
URL: http://localhost:${PORT}
API: http://localhost:${PORT}/api
Allowed Origins: ${getAllowedOrigins().join(', ')}
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
