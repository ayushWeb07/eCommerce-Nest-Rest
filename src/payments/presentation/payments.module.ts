import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersModule } from '../../orders/presentation/orders.module';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { PAYMENT_REPOSITORY_TOKEN } from '../application/ports/payment.repository.constants';
import DrizzlePaymentRepository from '../infrastructure/drizzle-payment.repository';
import { ORDER_TOKEN } from '../application/ports/order.constants';
import OrderAdapter from '../infrastructure/order.adapter';

@Module({
  imports: [CqrsModule, DrizzleModule, OrdersModule],
  controllers: [],
  providers: [
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: ORDER_TOKEN,
      useClass: OrderAdapter,
    },
  ],
})
export class PaymentsModule {}
