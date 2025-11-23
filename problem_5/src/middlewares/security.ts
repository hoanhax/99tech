import helmet from 'helmet';
import cors from 'cors';
import { securityConfig } from '@config/security';

export const helmetMiddleware = helmet(securityConfig.helmet);

export const corsMiddleware = cors(securityConfig.cors);
