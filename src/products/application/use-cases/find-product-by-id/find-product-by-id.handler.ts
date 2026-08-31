import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindProductByIdQuery } from './find-product-by-id.query';
import { Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_TOKEN } from '../../ports/product.repository.constants';
import type { ProductRepository } from '../../ports/product.repository.port';
import { Product } from '../../../domain/entities/product.entity';
import { ProductIdVo } from '../../../domain/value-objects/product-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(FindProductByIdQuery)
export class FindProductByIdHandler implements IQueryHandler<FindProductByIdQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: FindProductByIdQuery): Promise<Product> {
    // fetch the product using the products repo
    const fetchedProduct: Product | null =
      await this.productRepository.findById(new ProductIdVo(query.id));

    if (!fetchedProduct) {
      throw new ApplicationException(
        'Such product does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    return fetchedProduct;
  }
}
