import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.port';
import { Collection, Db } from 'mongodb';
import { MONGO_PROVIDER_TOKEN } from '../../../shared/infrastructure/database/mongo/mongo.constants';
import { Product } from '../../domain/entities/product.entity';
import { ProductIdVo } from 'src/products/domain/value-objects/product-id.vo';
import { SkuVo } from 'src/products/domain/value-objects/sku.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';

interface IProductDocument {
  _id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IPriceFilters {
  $gte?: number;
  $lte?: number;
}

interface IProductFilters {
  priceAmount?: IPriceFilters;
  isAvailable?: boolean;
}

@Injectable()
class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<IProductDocument>;

  constructor(
    @Inject(MONGO_PROVIDER_TOKEN)
    private readonly db: Db,
  ) {
    this.collection = this.db.collection<IProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    // insert the product into the db
    await this.collection.insertOne(
      MongoProductRepository.toMongoDocument(product),
    );
  }

  async findById(productId: ProductIdVo): Promise<Product | null> {
    // query the product from the db by id
    const fetchedProduct = await this.collection.findOne({
      _id: productId.getValue(),
    });

    if (!fetchedProduct) return null;

    return MongoProductRepository.toDomainEntity(fetchedProduct);
  }

  async findAll(productFilters: ProductFilters): Promise<Product[]> {
    // create the object containing the sql filters
    const sqlFilters: IProductFilters = {};

    if (productFilters?.minPrice || productFilters?.maxPrice) {
      sqlFilters.priceAmount = {};

      if (productFilters?.minPrice) {
        sqlFilters.priceAmount.$gte = productFilters.minPrice;
      }

      if (productFilters?.maxPrice) {
        sqlFilters.priceAmount.$lte = productFilters.maxPrice;
      }
    }

    if (productFilters?.isAvailable !== undefined) {
      sqlFilters.isAvailable = productFilters.isAvailable;
    }

    // query the products from the db
    let fetchedProducts: IProductDocument[] = [];

    if (Object.keys(sqlFilters).length > 0) {
      fetchedProducts = await this.collection.find(sqlFilters).toArray();
    } else {
      fetchedProducts = await this.collection.find().toArray();
    }

    // convert the mongo rows to domain entity
    return fetchedProducts.map((row: IProductDocument): Product =>
      MongoProductRepository.toDomainEntity(row),
    );
  }

  async findBySku(sku: SkuVo): Promise<Product | null> {
    // query the product from the db by sku
    const fetchedProduct = await this.collection.findOne({
      sku: sku.getValue(),
    });

    if (!fetchedProduct) return null;

    return MongoProductRepository.toDomainEntity(fetchedProduct);
  }

  async deleteById(productId: ProductIdVo): Promise<void> {
    // delete the product from the db
    await this.collection.deleteOne({
      _id: productId.getValue(),
    });
  }

  async update(product: Product): Promise<void> {
    // update the product from the db
    await this.collection.findOneAndUpdate(
      {
        _id: product.id.getValue(),
      },
      {
        $set: MongoProductRepository.toMongoDocument(product),
      },
    );
  }

  private static toMongoDocument(product: Product): IProductDocument {
    return {
      _id: product.id.getValue(),
      name: product.name,
      description: product.description,
      priceAmount: product.price.getAmount(),
      priceCurrency: product.price.getCurrency(),
      sku: product.sku.getValue(),
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isAvailable: product.isAvailable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomainEntity(row: IProductDocument): Product {
    // craft the product id vo
    const productId = new ProductIdVo(row._id);

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

export default MongoProductRepository;
