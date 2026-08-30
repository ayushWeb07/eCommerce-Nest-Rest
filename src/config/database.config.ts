import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoUri: process.env.MONGO_URI ?? '',
  mongoDbName: process.env.MONGO_DB_NAME ?? '',
  drizzleUri: process.env.DRIZZLE_URI ?? '',
}));
