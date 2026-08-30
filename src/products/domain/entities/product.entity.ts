import { AggregateRoot } from '@nestjs/cqrs';
import { ProductIdVo } from '../value-objects/product-id.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { SkuVo } from '../value-objects/sku.vo';
import { v4 as uuidv4 } from 'uuid';

export interface ProductProps {
  id: ProductIdVo;
  name: string;
  description: string;
  price: MoneyVo;
  sku: SkuVo;
  stock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private _id: ProductIdVo;
  private _name: string;
  private _description: string;
  private _price: MoneyVo;
  private _sku: SkuVo;
  private _stock: number;
  private _lowStockThreshold: number;
  private _isAvailable: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ProductProps) {
    super();

    // assign the corresponding properties
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._sku = props.sku;
    this._stock = props.stock;
    this._lowStockThreshold = props.lowStockThreshold;
    this._isAvailable = props.isAvailable;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    name: string,
    description: string,
    price: number,
    sku: string,
    stock: number,
    lowStockThreshold: number,
    isAvailable: boolean,
  ) {
    // create the product id vo
    const productIdVo = new ProductIdVo(uuidv4());

    // create the sku vo
    const skuVo = SkuVo.create(sku);

    // create the price vo
    const priceVo = MoneyVo.create(price);

    // get the current date for created at and updated at dates
    const currentDate = new Date();

    return new Product({
      id: productIdVo,
      name,
      description,
      price: priceVo,
      sku: skuVo,
      stock,
      lowStockThreshold,
      isAvailable,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  // to be used from database layer
  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  // id getter
  getId(): ProductIdVo {
    return this._id;
  }

  // name getter
  getName(): string {
    return this._name;
  }

  // description getter
  getDescription(): string {
    return this._description;
  }

  // price getter
  getPrice(): MoneyVo {
    return this._price;
  }

  // sku getter
  getSku(): SkuVo {
    return this._sku;
  }

  // stock getter
  getStock(): number {
    return this._stock;
  }

  // low stock threshold getter
  getLowStockThreshold(): number {
    return this._lowStockThreshold;
  }

  // is available getter
  getIsAvailable(): boolean {
    return this._isAvailable;
  }

  // created at getter
  getCreatedAt(): Date {
    return this._createdAt;
  }

  // updated at getter
  getUpdatedAt(): Date {
    return this._updatedAt;
  }
}
