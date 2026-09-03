import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_TOKEN } from '../../ports/product.repository.constants';
import type { ProductRepository } from '../../ports/product.repository.port';
import { ProductIdVo } from '../../../domain/value-objects/product-id.vo';
import { Product } from '../../../domain/entities/product.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const productId = new ProductIdVo(command.id);

    // check if a product with this id exist
    const existingProduct: Product | null =
      await this.productRepository.findById(productId);

    if (!existingProduct) {
      throw new ApplicationException(
        'Product with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // create the product domain entity
    const productToBeUpdated = Product.create(
      command.name ?? existingProduct.name,
      command.description ?? existingProduct.description,
      command.priceAmount ?? existingProduct.price.getAmount(),
      command.priceCurrency ?? existingProduct.price.getCurrency(),
      command.sku ?? existingProduct.sku.getValue(),
      command.stock ?? existingProduct.stock,
      command.lowStockThreshold ?? existingProduct.lowStockThreshold,
      command.isAvailable ?? existingProduct.isAvailable,
      command.id,
    );

    // update the product using the products repo
    await this.productRepository.update(productToBeUpdated);
  }
}
