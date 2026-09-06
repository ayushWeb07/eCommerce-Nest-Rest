import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { FindOrderItemByIdQuery } from './find-order-item-by-id.query';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { UniqueIdVo } from '../../../../shared/domain/value-objects/unique-id.vo';

@QueryHandler(FindOrderItemByIdQuery)
export class FindOrderItemByIdHandler implements IQueryHandler<FindOrderItemByIdQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: FindOrderItemByIdQuery): Promise<OrderItem> {
    // fetch the order item using the orders repo
    const fetchedOrderItem: OrderItem | null =
      await this.orderRepository.findOrderItemById(new UniqueIdVo(query.id));

    if (!fetchedOrderItem) {
      throw new ApplicationException(
        'Such order item does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    return fetchedOrderItem;
  }
}
