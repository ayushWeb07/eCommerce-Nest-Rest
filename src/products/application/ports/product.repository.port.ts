import { Product } from '../../domain/entities/product.entity';
import { ProductIdVo } from '../../domain/value-objects/product-id.vo';

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export interface ProductRepositoryPort {
  save(product: Product): Promise<void>;
  findById(productId: ProductIdVo): Promise<Product | null>;
  findAll(productFilters: ProductFilters): Promise<Product[]>;
}
