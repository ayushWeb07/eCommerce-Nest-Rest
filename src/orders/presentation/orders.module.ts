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
import { ConfirmOrderHandler } from '../application/use-cases/confirm-order/confirm-order.handler';
import { OrderConfirmedHandler } from '../application/event-handlers/order-confirmed.handler';
import { OrderShippedHandler } from '../application/event-handlers/order-shipped.handler';
import { ShipOrderHandler } from '../application/use-cases/ship-order/ship-order.handler';
import { OrderDeliveredHandler } from '../application/event-handlers/order-delivered.handler';
import { DeliverOrderHandler } from '../application/use-cases/deliver-order/deliver-order.handler';

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
    ConfirmOrderHandler,
    ShipOrderHandler,
    DeliverOrderHandler,

    OrderPlacedHandler,
    OrderConfirmedHandler,
    OrderShippedHandler,
    OrderDeliveredHandler,
  ],
})
export class OrdersModule {}
