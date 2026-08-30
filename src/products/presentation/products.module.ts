import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
