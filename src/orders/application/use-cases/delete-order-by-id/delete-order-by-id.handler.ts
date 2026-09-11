import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { DeleteOrderByIdCommand } from './delete-order-by-id.command';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import { Order } from '../../../domain/entities/order.entity';

@CommandHandler(DeleteOrderByIdCommand)
export class DeleteOrderByIdHandler implements ICommandHandler<DeleteOrderByIdCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: DeleteOrderByIdCommand): Promise<void> {
    const orderIdVo = new OrderIdVo(command.id);

    // check if the order with this id already exists
    const existingOrder: Order | null =
      await this.orderRepository.findOrderById(orderIdVo);

    if (!existingOrder) {
      throw new ApplicationException(
        'Order with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // delete the order using the orders repo
    await this.orderRepository.deleteOrderById(orderIdVo);
  }
}
