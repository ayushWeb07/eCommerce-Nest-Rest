import { Query } from '@nestjs/cqrs';
import { Order } from '../../../domain/entities/order.entity';

export class FindAllOrdersQuery extends Query<Order[]> {
  constructor() {
    super();
  }
}
