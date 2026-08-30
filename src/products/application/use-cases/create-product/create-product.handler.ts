import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Product } from '../../../domain/entities/product.entity';
import type { ProductRepository } from '../../ports/product.repository.port';
import { Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_TOKEN } from '../../ports/product.repository.constants';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    // create the product domain entity
    const newProduct = Product.create(
      command.name,
      command.description,
      command.priceAmount,
      command.priceCurrency,
      command.sku,
      command.stock,
      command.lowStockThreshold,
      command.isAvailable,
    );

    // create the product using the products repo
    await this.productRepository.save(newProduct);
  }
}
