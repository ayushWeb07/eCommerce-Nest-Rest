import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { FindAllOrdersByCustomerIdQuery } from './find-all-orders-by-customer-id.query';

@QueryHandler(FindAllOrdersByCustomerIdQuery)
export class FindAllOrdersByCustomerIdHandler implements IQueryHandler<FindAllOrdersByCustomerIdQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: FindAllOrdersByCustomerIdQuery): Promise<Order[]> {
    // fetch the orders using the orders repo
    const fetchedOrders: Order[] =
      await this.orderRepository.findAllOrdersByCustomerId(query.customerId);

    return fetchedOrders;
  }
}
