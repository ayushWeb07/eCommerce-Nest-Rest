import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shared/infrastructure/database/drizzle/schemas/index.ts',
  out: './src/shared/infrastructure/database/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_URI!,
  },
});
