// Security configurations
// We can add more config in future example: jwt config
import {securityConfig as envConfig} from "@config/env";

export const securityConfig = {
  generalLimiter: {
    windowMs: envConfig.rate_limit_window_ms,
    max: envConfig.rate_limit_max_requests,
    message: 'Too many requests from this IP, please try again later.',
  },
  cors: {
    origin: envConfig.allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
};
