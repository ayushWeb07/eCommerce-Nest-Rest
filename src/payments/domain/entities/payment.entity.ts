import { PaymentIdVo } from '../value-objects/payment-id.vo';
import { OrderIdVo } from '../../../orders/domain/value-objects/order-id.vo';
import { PaymentStatusVo } from '../value-objects/payment-status.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

export interface IPaymentProps {
  id: PaymentIdVo;
  orderId: string;
  status: PaymentStatusVo;
  payableAmount: MoneyVo;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _id: PaymentIdVo;
  private _orderId: string;
  private _status: PaymentStatusVo;
  private _payableAmount: MoneyVo;
  private _transactionId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: IPaymentProps) {
    super();

    this._id = props.id;
    this._orderId = props.orderId;
    this._status = props.status;
    this._payableAmount = props.payableAmount;
    this._transactionId = props.transactionId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    orderId: string,
    payableAmount: number,
    currency: string,
    id?: string,
  ) {
    // create the id vo
    const paymentIdVo = new PaymentIdVo(id ?? uuidv4());

    // create the status vo
    const paymentStatusVo = PaymentStatusVo.pending();

    // create the payable amount vo
    const payableAmountVo = MoneyVo.create(payableAmount, currency);

    // get the current date for created at and updated at dates
    const currentDate = new Date();

    // create the new payment entity
    const newPayment = new Payment({
      id: paymentIdVo,
      orderId,
      status: paymentStatusVo,
      payableAmount: payableAmountVo,
      transactionId: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return newPayment;
  }

  // to be used from database layer
  static reconstitute(props: IPaymentProps): Payment {
    return new Payment(props);
  }

  // id getter
  get id(): PaymentIdVo {
    return this._id;
  }

  // orderId getter
  get orderId(): string {
    return this._orderId;
  }

  // status getter
  get status(): PaymentStatusVo {
    return this._status;
  }

  // payableAmount getter
  get payableAmount(): MoneyVo {
    return this._payableAmount;
  }

  // transactionId getter
  get transactionId(): string | null {
    return this._transactionId;
  }

  // createdAt getter
  get createdAt(): Date {
    return this._createdAt;
  }

  // updatedAt getter
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
