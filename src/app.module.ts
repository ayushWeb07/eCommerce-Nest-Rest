import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envsValidationSchema from './config/validations/envs.validation';
import serverConfig from './config/server.config';
import databaseConfig from './config/database.config';
import { MongoModule } from './shared/infrastructure/database/mongo/mongo.module';
import { DrizzleModule } from './shared/infrastructure/database/drizzle/drizzle.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsModule } from './products/presentation/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envsValidationSchema,
      load: [serverConfig, databaseConfig],
    }),
    CqrsModule.forRoot(),
    MongoModule,
    DrizzleModule,
    ProductsModule,
  ],
})
export class AppModule {}
