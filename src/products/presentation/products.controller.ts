import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    await this.productsService.createProduct(createProductDto);
  }
}
