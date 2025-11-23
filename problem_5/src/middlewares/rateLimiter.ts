// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { securityConfig } from '@config/security';

export const generalLimiter = rateLimit(securityConfig.generalLimiter);
