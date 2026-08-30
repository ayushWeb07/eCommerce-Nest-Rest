import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductCommand } from '../../application/use-cases/create-product/create-product.command';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { FindAllProductsQuery } from '../../application/use-cases/find-all-products/find-all-products.query';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    // execute the create product command
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

  async findAllProducts(
    findAllProductsDto: FindAllProductsDto,
  ): Promise<Product[]> {
    // execute the find all products query
    const fetchedProducts: Product[] = await this.queryBus.execute(
      new FindAllProductsQuery(
        findAllProductsDto.minPrice,
        findAllProductsDto.maxPrice,
        findAllProductsDto.isAvailable,
      ),
    );

    return fetchedProducts;
  }
}
