import { AggregateRoot } from '@nestjs/cqrs';
import { OrderIdVo } from '../value-objects/order-id.vo';
import { ShippingAddressVo } from '../value-objects/shipping-address.vo';
import { OrderItem } from './order-item.entity';
import { OrderStatusVo } from '../value-objects/order-status.vo';
import { v4 as uuidv4 } from 'uuid';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderConfirmedEvent } from '../events/order-confirmed.event';

export interface IOrderProps {
  id: OrderIdVo;
  customerId: string;
  shippingAddress: ShippingAddressVo;
  items: OrderItem[];
  status: OrderStatusVo;
  trackingId: string | null;
  additionalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private _id: OrderIdVo;
  private _customerId: string;
  private _shippingAddress: ShippingAddressVo;
  private _items: OrderItem[];
  private _status: OrderStatusVo;
  private _trackingId: string | null;
  private _additionalNotes: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IOrderProps) {
    super();

    this._id = props.id;
    this._customerId = props.customerId;
    this._shippingAddress = props.shippingAddress;
    this._items = props.items;
    this._status = props.status;
    this._trackingId = props.trackingId;
    this._additionalNotes = props.additionalNotes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddressVo,
    additionalNotes: string | null,
    id?: string,
  ): Order {
    // create the order id vo
    const orderIdVo = new OrderIdVo(id ?? uuidv4());

    // create the order status vo
    const orderStatusVo = OrderStatusVo.pending();

    // get the current date for created at and updated at dates
    const currentDate = new Date();

    // create the new order instance
    const newOrder = new Order({
      id: orderIdVo,
      customerId,
      shippingAddress,
      items,
      status: orderStatusVo,
      trackingId: null,
      additionalNotes,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    // dispatch the create order event
    newOrder.apply(new OrderPlacedEvent(newOrder.id.getValue(), customerId));

    return newOrder;
  }

  private getTotalAmount(): number {
    const total = this._items.reduce((acc: number, curr: OrderItem): number => {
      return acc + curr.getSubtotal().getAmount();
    }, 0);

    return total;
  }

  getTotal(): MoneyVo {
    return MoneyVo.create(
      this.getTotalAmount(),
      this._items[0].unitPrice.getCurrency(),
    );
  }

  // to be used from database layer
  static reconstitute(props: IOrderProps): Order {
    return new Order(props);
  }

  // id getter
  get id(): OrderIdVo {
    return this._id;
  }

  // customerId getter
  get customerId(): string {
    return this._customerId;
  }

  // shippingAddress getter
  get shippingAddress(): ShippingAddressVo {
    return this._shippingAddress;
  }

  // items getter
  get items(): OrderItem[] {
    return this._items;
  }

  // status getter
  get status(): OrderStatusVo {
    return this._status;
  }

  // trackingId getter
  get trackingId(): string | null {
    return this._trackingId;
  }

  // additionalNotes getter
  get additionalNotes(): string | null {
    return this._additionalNotes;
  }

  // createdAt getter
  get createdAt(): Date {
    return this._createdAt;
  }

  // updatedAt getter
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // confirm the order
  confirm(): void {
    this._status = this._status.transitionToConfirmed();
    this._updatedAt = new Date();

    // dispatch the order confirmed event
    this.apply(new OrderConfirmedEvent(this._id.getValue(), this._customerId));
  }

  // ship the order
  ship(trackingId: string): void {
    this._status = this._status.transitionToShipped();
    this._trackingId = trackingId;
    this._updatedAt = new Date();

    // dispatch the order shipped event
    this.apply(new OrderPlacedEvent(this._id.getValue(), this._customerId));
  }
}
