import { Query } from '@nestjs/cqrs';
import { Customer } from '../../../domain/entities/customer.entity';

export class FindCustomerByIdQuery extends Query<Customer> {
  constructor(public readonly id: string) {
    super();
  }
}
