import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindAllProductsDto } from './dtos/find-all-products.dto';
import { ProductResponseDto } from './dtos/product-response.dto';

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
      message: 'Successfully created the new product',
      data: fetchedProducts,
    };
  }
}
