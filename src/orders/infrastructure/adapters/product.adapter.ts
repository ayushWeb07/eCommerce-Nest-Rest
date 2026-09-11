import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from '../../application/ports/product.port';
import { PRODUCT_REPOSITORY_TOKEN } from '../../../products/application/ports/product.repository.constants';
import type { ProductRepository } from '../../../products/application/ports/product.repository.port';
import { Product } from '../../../products/domain/entities/product.entity';
import { ProductIdVo } from '../../../products/domain/value-objects/product-id.vo';

@Injectable()
class ProductAdapter implements ProductPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async checkIfExists(productId: string): Promise<boolean> {
    const fetchedProduct: Product | null =
      await this.productRepository.findById(new ProductIdVo(productId));

    return fetchedProduct !== null;
  }
}

export default ProductAdapter;
