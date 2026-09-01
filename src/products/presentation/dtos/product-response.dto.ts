import { Product } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  id: string;

  name: string;
  description: string;
  sku: string;

  priceAmount: number;
  priceCurrency: string;

  stock: number;
  lowStockThreshold: number;
  isAvailable: boolean;

  createdAt: string;
  updatedAt: string;

  static fromDomainEntity(product: Product): ProductResponseDto {
    // create the dto entity and assign corresponding properties
    const productDto = new ProductResponseDto();

    productDto.id = product.id.getValue();
    productDto.name = product.name;
    productDto.description = product.description;
    productDto.sku = product.sku.getValue();
    productDto.priceAmount = product.price.getAmount();
    productDto.priceCurrency = product.price.getCurrency();
    productDto.stock = product.stock;
    productDto.lowStockThreshold = product.lowStockThreshold;
    productDto.isAvailable = product.isAvailable;
    productDto.createdAt = product.createdAt.toISOString();
    productDto.updatedAt = product.updatedAt.toISOString();

    return productDto;
  }
}
