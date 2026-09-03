import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllCustomersQuery } from './find-all-customers.query';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../ports/customer.repository.constants';
import type { CustomerRepository } from '../../ports/customer.repository.port';
import { Customer } from 'src/customers/domain/entities/customer.entity';

@QueryHandler(FindAllCustomersQuery)
export class FindAllCustomersHandler implements IQueryHandler<FindAllCustomersQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(): Promise<Customer[]> {
    // fetch the customers using the customers repo
    const fetchedCustomers: Customer[] =
      await this.customerRepository.findAll();

    return fetchedCustomers;
  }
}
