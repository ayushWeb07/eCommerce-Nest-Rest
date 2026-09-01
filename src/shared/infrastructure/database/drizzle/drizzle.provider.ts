import { DRIZZLE_PROVIDER_TOKEN } from './drizzle.constants';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from '../../../../config/interfaces/database_config.interface';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas/index';

export const drizzleProvider = {
  provide: DRIZZLE_PROVIDER_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    // get the database config
    const databaseConfig = configService.get<IDatabaseConfig>('database');

    if (!databaseConfig) {
      throw new Error('Database configuration must be setup');
    }

    // create a connection pool and drizzle instance
    const pool = new Pool({
      connectionString: databaseConfig.drizzleUri,
    });

    return drizzle({
      client: pool,
      schema,
    });
  },
};
