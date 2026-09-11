import { Query } from '@nestjs/cqrs';
import { OrderItem } from '../../../domain/entities/order-item.entity';

export class FindOrderItemByIdQuery extends Query<OrderItem> {
  constructor(public readonly id: string) {
    super();
  }
}
