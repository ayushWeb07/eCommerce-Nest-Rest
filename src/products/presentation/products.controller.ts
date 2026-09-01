import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindAllProductsDto } from './dtos/find-all-products.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { FindProductByIdDto } from './dtos/find-product-by-id.dto';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../shared/domain/exceptions/application.exception';
import { DeleteProductByIdDto } from './dtos/delete-product-by-id.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    // call the create product service
    await this.productsService.createProduct(createProductDto);

    return {
      success: true,
      message: 'Successfully created the new product',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllProducts(@Query() findAllProductsDto: FindAllProductsDto) {
    // call the find all products service
    const fetchedProducts: ProductResponseDto[] =
      await this.productsService.findAllProducts(findAllProductsDto);

    return {
      success: true,
      message: 'Successfully fetched all the products',
      data: fetchedProducts,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findProductById(@Param() findProductByIdDto: FindProductByIdDto) {
    // call the find by id product service
    const fetchedProduct: ProductResponseDto =
      await this.productsService.findProductById(findProductByIdDto);

    return {
      success: true,
      message: 'Successfully fetched the product by id',
      data: fetchedProduct,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param() deleteProductByIdDto: DeleteProductByIdDto) {
    // call the delete product by id service
    await this.productsService.deleteProductById(deleteProductByIdDto);

    return {
      success: true,
      message: 'Successfully deleted the product by id',
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    // call the update product service
    await this.productsService.updateProduct(updateProductDto);

    return {
      success: true,
      message: 'Successfully updated the product by id',
    };
  }
}
