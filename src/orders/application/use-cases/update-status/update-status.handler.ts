import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { UpdateStatusCommand } from './update-status.command';
import { OrderStatusVo } from '../../../domain/value-objects/order-status.vo';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusHandler implements ICommandHandler<UpdateStatusCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: UpdateStatusCommand): Promise<void> {
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

    // update the status using the orders repo
    await this.orderRepository.updateOrderStatus(
      orderId,
      OrderStatusVo.fromString(command.status),
    );
  }
}
