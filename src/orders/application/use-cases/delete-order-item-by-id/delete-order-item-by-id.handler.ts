import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { DeleteOrderItemByIdCommand } from './delete-order-item-by-id.command';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { UniqueIdVo } from '../../../../shared/domain/value-objects/unique-id.vo';
import { OrderItem } from '../../../domain/entities/order-item.entity';

@CommandHandler(DeleteOrderItemByIdCommand)
export class DeleteOrderItemByIdHandler implements ICommandHandler<DeleteOrderItemByIdCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: DeleteOrderItemByIdCommand): Promise<void> {
    const orderItemIdVo = new UniqueIdVo(command.id);

    // check if the order item with this id already exists
    const existingOrderItem: OrderItem | null =
      await this.orderRepository.findOrderItemById(orderItemIdVo);

    if (!existingOrderItem) {
      throw new ApplicationException(
        'Order item with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // delete the order item using the orders repo
    await this.orderRepository.deleteOrderItemById(orderItemIdVo);
  }
}
