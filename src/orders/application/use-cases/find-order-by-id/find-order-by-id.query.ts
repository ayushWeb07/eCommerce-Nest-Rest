import { Query } from '@nestjs/cqrs';
import { Order } from '../../../domain/entities/order.entity';

export class FindOrderByIdQuery extends Query<Order> {
  constructor(public readonly id: string) {
    super();
  }
}
