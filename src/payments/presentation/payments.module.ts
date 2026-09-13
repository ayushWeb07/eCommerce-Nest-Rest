import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersModule } from '../../orders/presentation/orders.module';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { PAYMENT_REPOSITORY_TOKEN } from '../application/ports/payment.repository.constants';
import DrizzlePaymentRepository from '../infrastructure/adapters/drizzle-payment.repository';
import OrderPricingAdapter from '../infrastructure/adapters/order-pricing.adapter';
import { PAYMENT_GATEWAY_TOKEN } from '../application/ports/payment-gateway.constants';
import StripePaymentAdapter from '../infrastructure/adapters/stripe-payment.adapter';
import { ORDER_PRICING_TOKEN } from '../application/ports/order-pricing.constants';

@Module({
  imports: [CqrsModule, DrizzleModule, OrdersModule],
  controllers: [],
  providers: [
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: ORDER_PRICING_TOKEN,
      useClass: OrderPricingAdapter,
    },
    {
      provide: PAYMENT_GATEWAY_TOKEN,
      useClass: StripePaymentAdapter,
    },
  ],
})
export class PaymentsModule {}
