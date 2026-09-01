import { Product } from '../../domain/entities/product.entity';
import { ProductIdVo } from '../../domain/value-objects/product-id.vo';
import { SkuVo } from '../../domain/value-objects/sku.vo';

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(productId: ProductIdVo): Promise<Product | null>;
  findAll(productFilters: ProductFilters): Promise<Product[]>;
  findBySku(sku: SkuVo): Promise<Product | null>;
  deleteById(productId: ProductIdVo): Promise<void>;
}
