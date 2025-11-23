// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Environment variables validation
export const serverConfig = {
  port: process.env.PORT || 4000,
  node_env: process.env.NODE_ENV || 'development',
};

const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '';
const dbPort = parseInt(process.env.DB_PORT || '');
const dbName = process.env.DB_NAME || '';
const dbSchema = process.env.DB_SCHEMA || 'public'

const encodedUser = encodeURIComponent(dbUser);
const encodedPassword = encodeURIComponent(dbPassword);
const encodedDb = encodeURIComponent(dbName);

export const databaseConfig = {
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  schema: dbSchema,
  url: `postgresql://${encodedUser}:${encodedPassword}@${dbHost}:${dbPort}/${encodedDb}?schema=${dbSchema}`,
};

export const securityConfig = {
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
  ).split(','),
  rate_limit_window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  rate_limit_max_requests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  ), // max requests per window
};

export const commonConfig = {
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const authConfig = {
  enableMockAuth: process.env.ENABLE_MOCK_AUTH === 'true',
};
