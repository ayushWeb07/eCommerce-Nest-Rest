import { Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';
import { DRIZZLE_PROVIDER_TOKEN } from './drizzle.constants';

@Module({
  providers: [drizzleProvider],
  exports: [DRIZZLE_PROVIDER_TOKEN],
})
export class DrizzleModule {}
