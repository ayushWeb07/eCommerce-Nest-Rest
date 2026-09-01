import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import { ProductIdVo } from '../../domain/value-objects/product-id.vo';
import { DRIZZLE_PROVIDER_TOKEN } from '../../../shared/infrastructure/database/drizzle/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../shared/infrastructure/database/drizzle/schemas/index';
import { SelectProductType } from '../../../shared/infrastructure/database/drizzle/types/product.type';
import { products } from '../../../shared/infrastructure/database/drizzle/schemas/index';
import { SkuVo } from 'src/products/domain/value-objects/sku.vo';
import { MoneyVo } from 'src/shared/domain/value-objects/money.vo';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
class DrizzleProductRepository implements ProductRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async save(product: Product): Promise<void> {
    // insert the product into the db
    await this.db
      .insert(products)
      .values(DrizzleProductRepository.toDrizzleSchema(product));
  }

  async findAll(productFilters: ProductFilters): Promise<Product[]> {
    // create the array containing the sql filters
    const sqlFilters: SQL[] = [];

    if (productFilters?.minPrice) {
      sqlFilters.push(gte(products.priceAmount, productFilters.minPrice));
    }

    if (productFilters?.maxPrice) {
      sqlFilters.push(lte(products.priceAmount, productFilters.maxPrice));
    }

    if (productFilters?.isAvailable !== undefined) {
      sqlFilters.push(eq(products.isAvailable, productFilters.isAvailable));
    }

    // query the products from the db
    let fetchedProducts: SelectProductType[] = [];

    if (sqlFilters.length > 0) {
      fetchedProducts = await this.db
        .select()
        .from(products)
        .where(and(...sqlFilters));
    } else {
      fetchedProducts = await this.db.select().from(products);
    }

    // convert the drizzle rows to domain entity
    return fetchedProducts.map((row: SelectProductType): Product =>
      DrizzleProductRepository.toDomainEntity(row),
    );
  }

  async findById(productId: ProductIdVo): Promise<Product | null> {
    // query the product from the db
    const [fetchedProduct] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, productId.getValue()));

    if (!fetchedProduct) return null;

    return DrizzleProductRepository.toDomainEntity(fetchedProduct);
  }

  async deleteById(productId: ProductIdVo): Promise<void> {
    // delete the product from the db
    await this.db.delete(products).where(eq(products.id, productId.getValue()));
  }

  async findBySku(sku: SkuVo): Promise<Product | null> {
    // query the product from the db
    const [fetchedProduct] = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.getValue()));

    if (!fetchedProduct) return null;

    return DrizzleProductRepository.toDomainEntity(fetchedProduct);
  }

  private static toDrizzleSchema(product: Product): SelectProductType {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.getAmount(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isAvailable: product.isAvailable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomainEntity(row: SelectProductType): Product {
    // craft the product id vo
    const productId = new ProductIdVo(row.id);

    // craft the sku vo
    const skuVo = SkuVo.create(row.sku);

    // craft the price vo
    const priceVo = MoneyVo.create(row.priceAmount, row.priceCurrency);

    return Product.reconstitute({
      id: productId,
      name: row.name,
      description: row.description,
      sku: skuVo,
      price: priceVo,
      stock: row.stock,
      lowStockThreshold: row.lowStockThreshold,
      isAvailable: row.isAvailable,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

export default DrizzleProductRepository;
