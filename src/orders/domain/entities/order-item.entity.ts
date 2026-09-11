import { v4 as uuidv4 } from 'uuid';
import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';

export interface IOrderItemProps {
  id: UniqueIdVo;
  productId: string;
  productName: string;
  unitPrice: MoneyVo;
  quantity: number;
  discount: MoneyVo | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderItem extends AggregateRoot {
  private _id: UniqueIdVo;
  private _productId: string;
  private _productName: string;
  private _unitPrice: MoneyVo;
  private _quantity: number;
  private _discount: MoneyVo | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IOrderItemProps) {
    super();

    this._id = props.id;
    this._productId = props.productId;
    this._productName = props.productName;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
    this._discount = props.discount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    productId: string,
    productName: string,
    unitPriceAmount: number,
    quantity: number,
    discountAmount: number | null,
    currency: string,
    id?: string,
  ): OrderItem {
    // create the id vo
    const idVo = new UniqueIdVo(id ?? uuidv4());

    // create the unit price vo
    const unitPriceVo = MoneyVo.create(unitPriceAmount, currency);

    // create the discount vo
    const discountVo: MoneyVo | null =
      discountAmount !== null ? MoneyVo.create(discountAmount, currency) : null;

    // get the current date for created at and updated at dates
    const currentDate = new Date();

    return new OrderItem({
      id: idVo,
      productId,
      productName,
      unitPrice: unitPriceVo,
      quantity,
      discount: discountVo,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  // to be used from database layer
  static reconstitute(props: IOrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  // id getter
  get id(): UniqueIdVo {
    return this._id;
  }

  // productId getter
  get productId(): string {
    return this._productId;
  }

  // productName getter
  get productName(): string {
    return this._productName;
  }

  // unitPrice getter
  get unitPrice(): MoneyVo {
    return this._unitPrice;
  }

  // quantity getter
  get quantity(): number {
    return this._quantity;
  }

  // discount getter
  get discount(): MoneyVo | null {
    return this._discount;
  }

  // createdAt getter
  get createdAt(): Date {
    return this._createdAt;
  }

  // updatedAt getter
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateQuantity(qty: number): void {
    this._quantity = qty;
  }

  applyDiscount(discountAmount: number): void {
    // check if the discount is more than the unit price itself
    if (discountAmount > this._unitPrice.getAmount() * this._quantity) {
      throw new ApplicationException(
        `Discount amount cannot exceed the actual subtotal of the order item`,
        ApplicationExceptionStatus.BAD_REQUEST,
      );
    }

    this._discount = MoneyVo.create(
      discountAmount,
      this._unitPrice.getCurrency(),
    );
  }

  removeDiscount(): void {
    this._discount = null;
  }

  private getSubtotalAmount(): number {
    let subtotal = this._unitPrice.getAmount() * this._quantity;

    if (this._discount) {
      subtotal -= this._discount.getAmount();
    }

    return subtotal;
  }

  getSubtotal(): MoneyVo {
    return MoneyVo.create(
      this.getSubtotalAmount(),
      this._unitPrice.getCurrency(),
    );
  }
}
