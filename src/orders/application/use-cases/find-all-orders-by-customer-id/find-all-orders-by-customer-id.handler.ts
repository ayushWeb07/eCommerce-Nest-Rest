import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { FindAllOrdersByCustomerIdQuery } from './find-all-orders-by-customer-id.query';
import { CUSTOMER_TOKEN } from '../../ports/customer.constants';
import type { CustomerPort } from '../../ports/customer.port';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(FindAllOrdersByCustomerIdQuery)
export class FindAllOrdersByCustomerIdHandler implements IQueryHandler<FindAllOrdersByCustomerIdQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    @Inject(CUSTOMER_TOKEN)
    private readonly customerPort: CustomerPort,
  ) {}

  async execute(query: FindAllOrdersByCustomerIdQuery): Promise<Order[]> {
    // check if customer actually exists
    const customerExists: boolean = await this.customerPort.checkIfExists(
      query.customerId,
    );

    if (!customerExists) {
      throw new ApplicationException(
        'Such customer does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // fetch the orders using the orders repo
    const fetchedOrders: Order[] =
      await this.orderRepository.findAllOrdersByCustomerId(query.customerId);

    return fetchedOrders;
  }
}
