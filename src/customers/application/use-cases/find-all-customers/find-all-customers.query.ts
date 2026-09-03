import { Query } from '@nestjs/cqrs';
import { Customer } from '../../../domain/entities/customer.entity';

export class FindAllCustomersQuery extends Query<Customer[]> {
  constructor() {
    super();
  }
}
