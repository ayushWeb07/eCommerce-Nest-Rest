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
import { CUSTOMER_TOKEN } from '../application/ports/customer.constants';
import CustomerAdapter from '../infrastructure/adapters/customer.adapter';
import { PRODUCT_TOKEN } from '../application/ports/product.constants';
import ProductAdapter from '../infrastructure/adapters/product.adapter';
import { OrderPlacedHandler } from '../application/event-handlers/order-placed.handler';
import { FindAllOrdersByCustomerIdHandler } from '../application/use-cases/find-all-orders-by-customer-id/find-all-orders-by-customer-id.handler';
import { FindOrderByIdHandler } from '../application/use-cases/find-order-by-id/find-order-by-id.handler';
import { FindAllOrdersHandler } from '../application/use-cases/find-all-orders/find-all-orders.handler';
import { UpdateStatusHandler } from '../application/use-cases/update-status/update-status.handler';

@Module({
  imports: [CqrsModule, DrizzleModule, CustomersModule, ProductsModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER_TOKEN,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT_TOKEN,
      useClass: ProductAdapter,
    },
    OrdersService,

    CreateOrderHandler,
    FindAllOrdersByCustomerIdHandler,
    FindOrderByIdHandler,
    FindAllOrdersHandler,
    UpdateStatusHandler,
    OrderPlacedHandler,
  ],
})
export class OrdersModule {}
