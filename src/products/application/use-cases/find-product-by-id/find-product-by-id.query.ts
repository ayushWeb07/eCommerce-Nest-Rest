import { Query } from '@nestjs/cqrs';
import { Product } from '../../../domain/entities/product.entity';

export class FindProductByIdQuery extends Query<Product> {
  constructor(public readonly id: string) {
    super();
  }
}
