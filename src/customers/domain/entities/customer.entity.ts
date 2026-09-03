import { AggregateRoot } from '@nestjs/cqrs';
import { CustomerIdVo } from '../value-objects/customer-id.vo';
import { EmailVo } from '../value-objects/email.vo';
import { v4 as uuidv4 } from 'uuid';

export interface ICustomerProps {
  id: CustomerIdVo;
  firstName: string;
  lastName: string;
  email: EmailVo;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends AggregateRoot {
  private _id: CustomerIdVo;
  private _firstName: string;
  private _lastName: string;
  private _email: EmailVo;
  private _phone: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ICustomerProps) {
    super();

    // assign the corresponding properties
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    isActive: boolean,
    id?: string,
  ): Customer {
    // create the customer id vo
    const customerIdVo = new CustomerIdVo(id ?? uuidv4());

    // create the email vo
    const emailVo = EmailVo.create(email);

    // get the current date for created at and updated at dates
    const currentDate = new Date();

    return new Customer({
      id: customerIdVo,
      firstName,
      lastName,
      email: emailVo,
      phone,
      isActive,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  // to be used from database layer
  static reconstitute(props: ICustomerProps): Customer {
    return new Customer(props);
  }

  // id getter
  get id(): CustomerIdVo {
    return this._id;
  }

  // firstname getter
  get firstName(): string {
    return this._firstName;
  }

  // lastName getter
  get lastName(): string {
    return this._lastName;
  }

  // email getter
  get email(): EmailVo {
    return this._email;
  }

  // phone getter
  get phone(): string {
    return this._phone;
  }

  // isActive getter
  get isActive(): boolean {
    return this._isActive;
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
