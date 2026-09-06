import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrdersQuery } from './find-all-orders.query';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from 'src/orders/domain/entities/order.entity';

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler implements IQueryHandler<FindAllOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: FindAllOrdersQuery): Promise<Order[]> {
    // fetch the orders using the orders repo
    const fetchedOrders: Order[] = await this.orderRepository.findAllOrders();

    return fetchedOrders;
  }
}
