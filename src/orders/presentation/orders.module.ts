import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { ORDER_REPOSITORY_TOKEN } from '../application/ports/order.repository.constants';
import DrizzleOrderRepository from '../infrastructure/adapters/drizzle-order.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: DrizzleOrderRepository,
    },
    OrdersService,
  ],
})
export class OrdersModule {}
