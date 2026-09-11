import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ShipOrderCommand } from './ship-order.command';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import { Order } from '../../../domain/entities/order.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(ShipOrderCommand)
export class ShipOrderHandler implements ICommandHandler<ShipOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ShipOrderCommand): Promise<void> {
    const orderId = new OrderIdVo(command.orderId);

    // fetch the order using the orders repo
    const fetchedOrder: Order | null =
      await this.orderRepository.findOrderById(orderId);

    if (!fetchedOrder) {
      throw new ApplicationException(
        'Such order does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // ship the order
    const trackedOrder = this.eventPublisher.mergeObjectContext(fetchedOrder);
    trackedOrder.ship(command.trackingId);

    // update in the orders repo
    await this.orderRepository.updateOrder(trackedOrder);

    // finally dispatch all the outstanding events
    trackedOrder.commit();
  }
}
