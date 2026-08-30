import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsService } from './services/products.service';
import { PRODUCT_REPOSITORY_TOKEN } from '../application/ports/product.repository.constants';
import DrizzleProductRepository from '../intrastructure/adapters/drizzle-product.repository';
import { CreateProductHandler } from '../application/use-cases/create-product/create-product.handler';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { FindAllProductsHandler } from '../application/use-cases/find-all-products/find-all-products.handler';

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: DrizzleProductRepository,
    },
    CreateProductHandler,
    FindAllProductsHandler,
  ],
})
export class ProductsModule {}
