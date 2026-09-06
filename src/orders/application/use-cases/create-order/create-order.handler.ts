import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    // create the order domain entity
    const newOrder = Order.create(
      command.customerId,
      command.items,
      command.shippingAddress,
      command.additionalNotes,
    );

    // create the order using the orders repo
    await this.orderRepository.saveOrder(newOrder);
  }
}
