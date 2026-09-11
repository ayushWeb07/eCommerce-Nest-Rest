import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeliverOrderCommand } from './deliver-order.command';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import { Order } from '../../../domain/entities/order.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { OrderStatusVo } from '../../../domain/value-objects/order-status.vo';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderHandler implements ICommandHandler<DeliverOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<void> {
    const orderId = new OrderIdVo(command.id);

    // fetch the order using the orders repo
    const fetchedOrder: Order | null =
      await this.orderRepository.findOrderById(orderId);

    if (!fetchedOrder) {
      throw new ApplicationException(
        'Such order does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // mark the order as delivered
    const trackingOrder = this.eventPublisher.mergeObjectContext(fetchedOrder);
    trackingOrder.deliver();

    // update the status using the orders repo
    await this.orderRepository.updateOrderStatus(
      orderId,
      OrderStatusVo.delivered(),
    );

    // dispatch all the outstanding events
    trackingOrder.commit();
  }
}
