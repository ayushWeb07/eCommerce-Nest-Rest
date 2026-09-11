import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CancelOrderCommand } from './cancel-order.command';
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

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
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

    // cancel the order
    const trackedOrder = this.eventPublisher.mergeObjectContext(fetchedOrder);
    trackedOrder.cancel();

    // update the status using the orders repo
    await this.orderRepository.updateOrderStatus(
      orderId,
      OrderStatusVo.cancelled(),
    );

    // finally dispatch all the outstanding events
    trackedOrder.commit();
  }
}
