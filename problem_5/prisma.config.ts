import 'dotenv/config'
import { defineConfig } from "prisma/config";
import {databaseConfig} from './src/config/env'

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseConfig.url || '',
  },
});
