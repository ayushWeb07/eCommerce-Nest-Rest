import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductByIdCommand } from './delete-product-by-id.command';
import { Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_TOKEN } from '../../ports/product.repository.constants';
import type { ProductRepository } from '../../ports/product.repository.port';
import { ProductIdVo } from '../../../domain/value-objects/product-id.vo';
import { Product } from '../../../domain/entities/product.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(DeleteProductByIdCommand)
export class DeleteProductByIdHandler implements ICommandHandler<DeleteProductByIdCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductByIdCommand): Promise<void> {
    const productId = new ProductIdVo(command.id);

    // check if a product with this id already exists
    const existingProduct: Product | null =
      await this.productRepository.findById(productId);

    if (!existingProduct) {
      throw new ApplicationException(
        'Product with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // delete the product using the products repo
    await this.productRepository.deleteById(productId);
  }
}
