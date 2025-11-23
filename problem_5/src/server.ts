import app from './app';
import { serverConfig } from './config/env';
import { Logger } from './utils/logger';

const PORT = serverConfig.port;
async function startServer() {
  try {
    app.listen(PORT, () => {
      Logger.debug(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    Logger.error('Error connecting to database', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason: any) => {
  Logger.error('Unhandled Rejection at:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
