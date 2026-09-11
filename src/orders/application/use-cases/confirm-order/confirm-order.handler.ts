import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { ConfirmOrderCommand } from './confirm-order.command';
import { OrderStatusVo } from '../../../domain/value-objects/order-status.vo';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
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

    // confirm the order
    const trackedOrder = this.eventPublisher.mergeObjectContext(fetchedOrder);
    trackedOrder.confirm();

    // update the status using the orders repo
    await this.orderRepository.updateOrderStatus(
      orderId,
      OrderStatusVo.confirmed(),
    );

    // finally dispatch all the outstanding events
    trackedOrder.commit();
  }
}
