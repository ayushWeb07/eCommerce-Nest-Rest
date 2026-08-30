import { Body, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductCommand } from '../../application/use-cases/create-product/create-product.command';

@Injectable()
export class ProductsService {
  constructor(private readonly commandBus: CommandBus) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    await this.commandBus.execute(
      new CreateProductCommand(
        createProductDto.name,
        createProductDto.description,
        createProductDto.sku,
        createProductDto.priceAmount,
        createProductDto.priceCurrency,
        createProductDto.stock,
        createProductDto.lowStockThreshold,
        createProductDto.isAvailable,
      ),
    );
  }
}
