import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { ORDER_REPOSITORY_TOKEN } from '../application/ports/order.repository.constants';
import DrizzleOrderRepository from '../infrastructure/adapters/drizzle-order.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { CreateOrderHandler } from '../application/use-cases/create-order/create-order.handler';
import { CustomersModule } from '../../customers/presentation/customers.module';
import { ProductsModule } from '../../products/presentation/products.module';

@Module({
  imports: [CqrsModule, DrizzleModule, CustomersModule, ProductsModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: DrizzleOrderRepository,
    },
    OrdersService,

    CreateOrderHandler,
  ],
})
export class OrdersModule {}
