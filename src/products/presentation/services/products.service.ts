import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CreateProductCommand } from '../../application/use-cases/create-product/create-product.command';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import { FindAllProductsQuery } from '../../application/use-cases/find-all-products/find-all-products.query';
import { Product } from '../../domain/entities/product.entity';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { FindProductByIdDto } from '../dtos/find-product-by-id.dto';
import { FindProductByIdQuery } from '../../application/use-cases/find-product-by-id/find-product-by-id.query';
import { DeleteProductByIdDto } from '../dtos/delete-product-by-id.dto';
import { DeleteProductByIdCommand } from '../../application/use-cases/delete-product-by-id/delete-product-by-id.command';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { UpdateProductCommand } from '../../application/use-cases/update-product/update-product.command';

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
  ): Promise<ProductResponseDto[]> {
    // execute the find all products query
    const fetchedProducts: Product[] = await this.queryBus.execute(
      new FindAllProductsQuery(
        findAllProductsDto.minPrice,
        findAllProductsDto.maxPrice,
        findAllProductsDto.isAvailable,
      ),
    );

    // convert them from product entities to product response dto
    return fetchedProducts.map((prod: Product): ProductResponseDto =>
      ProductResponseDto.fromDomainEntity(prod),
    );
  }

  async findProductById(
    findProductByIdDto: FindProductByIdDto,
  ): Promise<ProductResponseDto> {
    // execute the find product by id query
    const fetchedProduct: Product = await this.queryBus.execute(
      new FindProductByIdQuery(findProductByIdDto.id),
    );

    // convert them from product entity to product response dto
    return ProductResponseDto.fromDomainEntity(fetchedProduct);
  }

  async deleteProductById(deleteProductByIdDto: DeleteProductByIdDto): Promise<void> {
    // execute the delete product command
    await this.commandBus.execute(
      new DeleteProductByIdCommand(deleteProductByIdDto.id),
    );
  }

  async updateProduct(updateProductDto: UpdateProductDto): Promise<void> {
    // execute the update product command
    await this.commandBus.execute(
      new UpdateProductCommand(
        updateProductDto.id,
        updateProductDto?.name,
        updateProductDto?.description,
        updateProductDto?.sku,
        updateProductDto?.priceAmount,
        updateProductDto?.priceCurrency,
        updateProductDto?.stock,
        updateProductDto?.lowStockThreshold,
        updateProductDto?.isAvailable,
      ),
    );
  }
}
