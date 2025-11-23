import express, { Application } from 'express';
import { helmetMiddleware } from './middlewares/security';
import { corsMiddleware } from './middlewares/security';
import { generalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { checkSwaggerEnabled, getSwaggerSetup } from './middlewares/swagger';
import routes from './routers';

const app: Application = express();

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation (Development only)
const { serve, setup } = getSwaggerSetup();
app.use('/api-docs', checkSwaggerEnabled, serve, setup);

// API Routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(errorHandler);

export default app;
