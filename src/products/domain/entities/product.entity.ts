import { AggregateRoot } from '@nestjs/cqrs';
import { ProductIdVo } from '../value-objects/product-id.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { SkuVo } from '../value-objects/sku.vo';

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
}