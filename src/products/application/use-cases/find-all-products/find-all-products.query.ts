import { Query } from '@nestjs/cqrs';
import { Product } from '../../../domain/entities/product.entity';

export class FindAllProductsQuery extends Query<Product[]> {
  constructor(
    public readonly minPrice?: number,
    public readonly maxPrice?: number,
    public readonly isAvailable?: boolean,
  ) {
    super();
  }
}
