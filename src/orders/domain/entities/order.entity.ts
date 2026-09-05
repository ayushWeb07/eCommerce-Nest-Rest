import { AggregateRoot } from '@nestjs/cqrs';

export interface IOrderProps {}

export class Order extends AggregateRoot {}
