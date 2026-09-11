import { Query } from '@nestjs/cqrs';
import { Order } from '../../../domain/entities/order.entity';

export class FindAllOrdersByCustomerIdQuery extends Query<Order[]> {
  constructor(public readonly customerId: string) {
    super();
  }
}
