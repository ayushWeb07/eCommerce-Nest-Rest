import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsService } from './services/products.service';
import { PRODUCT_REPOSITORY_TOKEN } from '../application/ports/product.repository.constants';
import DrizzleProductRepository from '../intrastructure/adapters/drizzle-product.repository';
import { CreateProductHandler } from '../application/use-cases/create-product/create-product.handler';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { FindAllProductsHandler } from '../application/use-cases/find-all-products/find-all-products.handler';
import { FindProductByIdHandler } from '../application/use-cases/find-product-by-id/find-product-by-id.handler';
import { DeleteProductByIdHandler } from '../application/use-cases/delete-product-by-id/delete-product-by-id.handler';
import { UpdateProductHandler } from '../application/use-cases/update-product/update-product.handler';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig } from '../../config/interfaces/database_config.interface';
import MongoProductRepository from '../intrastructure/adapters/mongo-product.repository';
import { MongoModule } from '../../shared/infrastructure/database/mongo/mongo.module';

@Module({
  imports: [CqrsModule, DrizzleModule, MongoModule],
  controllers: [ProductsController],
  providers: [
    DrizzleProductRepository,
    MongoProductRepository,

    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      inject: [ConfigService, DrizzleProductRepository, MongoProductRepository],
      useFactory: (
        configService: ConfigService,
        drizzleRepo: DrizzleProductRepository,
        mongoRepo: MongoProductRepository,
      ) => {
        // get the database config
        const databaseConfig = configService.get<IDatabaseConfig>('database');

        if (!databaseConfig) {
          throw new Error('Database configuration must be setup');
        }

        // conditionally use the repository based on env
        if (databaseConfig.useDb === 'postgres') {
          return drizzleRepo;
        } else {
          return mongoRepo;
        }
      },
    },

    ProductsService,
    CreateProductHandler,
    FindAllProductsHandler,
    FindProductByIdHandler,
    DeleteProductByIdHandler,
    UpdateProductHandler,
  ],
})
export class ProductsModule {}
