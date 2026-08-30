import { MONGO_PROVIDER_TOKEN } from './mongo.constants';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from '../../../../config/interfaces/database_config.interface';
import { MongoClient, Db } from 'mongodb';

export const mongoProvider = {
  provide: MONGO_PROVIDER_TOKEN,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Db> => {
    // get the database config
    const databaseConfig = configService.get<IDatabaseConfig>('database');

    if (!databaseConfig) {
      throw new Error('Database configuration must be setup');
    }

    // create the mongo client and connect
    const client = new MongoClient(databaseConfig.mongoUri);
    await client.connect();

    return client.db(databaseConfig.mongoDbName);
  },
};
