import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllProductsQuery } from './find-all-products.query';
import { Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_TOKEN } from '../../ports/product.repository.constants';
import type { ProductRepository } from '../../ports/product.repository.port';
import { Product } from '../../../domain/entities/product.entity';

@QueryHandler(FindAllProductsQuery)
export class FindAllProductsHandler implements IQueryHandler<FindAllProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: FindAllProductsQuery): Promise<Product[]> {
    // create the product using the products repo
    const fetchedProducts: Product[] = await this.productRepository.findAll({
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      isAvailable: query.isAvailable,
    });

    return fetchedProducts;
  }
}
