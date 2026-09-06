import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrdersQuery } from '../find-all-orders/find-all-orders.query';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { FindOrderByIdQuery } from './find-order-by-id.query';
import { OrderIdVo } from '../../../domain/value-objects/order-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(FindOrderByIdQuery)
export class FindOrderByIdHandler implements IQueryHandler<FindOrderByIdQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: FindOrderByIdQuery): Promise<Order> {
    // fetch the order using the orders repo
    const fetchedOrder: Order | null = await this.orderRepository.findById(
      new OrderIdVo(query.id),
    );

    if (!fetchedOrder) {
      throw new ApplicationException(
        'Such order does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    return fetchedOrder;
  }
}
