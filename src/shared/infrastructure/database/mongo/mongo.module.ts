import { Module } from '@nestjs/common';
import { mongoProvider } from './mongo.provider';
import { MONGO_PROVIDER_TOKEN } from './mongo.constants';

@Module({
  providers: [mongoProvider],
  exports: [MONGO_PROVIDER_TOKEN],
})
export class MongoModule {}
