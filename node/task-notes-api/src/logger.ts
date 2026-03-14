import pino from 'pino';
import { loadConfig } from './config';

const config = loadConfig();

export const logger = pino({
  level: config.logLevel || 'info',
  // Simplified transport config to ensure it works in WSL/Linux
  transport: config.env === 'development' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});