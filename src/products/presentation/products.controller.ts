import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
}
