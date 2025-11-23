import { PrismaClient } from '@prisma/client';
import { Logger } from '@utils/logger';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';


import { databaseConfig } from '@config/env';

class DatabaseClient {
  private static instance: PrismaClient;
  private static pool: Pool;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      const connectionString = databaseConfig.url;

      if (!connectionString) {
        throw new Error('Database connection string could not be generated');
      }

      DatabaseClient.pool = new Pool({ connectionString });
      const adapter = new PrismaPg(DatabaseClient.pool);
      DatabaseClient.instance = new PrismaClient({ adapter });
    }

    DatabaseClient.instance
      .$connect()
      .then(() => {
        Logger.info('Connected to database');
      })
      .catch((error: any) => {
        Logger.error('Error connecting to database:', error);
        process.exit(1);
      });

    return DatabaseClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
    }
    if (DatabaseClient.pool) {
      await DatabaseClient.pool.end();
    }
  }
}

export const prisma = DatabaseClient.getInstance();

export const disconnectDatabase = async () => {
  await DatabaseClient.disconnect();
};
