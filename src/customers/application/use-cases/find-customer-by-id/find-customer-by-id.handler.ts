import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindCustomerByIdQuery } from './find-customer-by-id.query';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../ports/customer.repository.constants';
import type { CustomerRepository } from '../../ports/customer.repository.port';
import { Customer } from 'src/customers/domain/entities/customer.entity';
import { CustomerIdVo } from '../../../domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(FindCustomerByIdQuery)
export class FindCustomerByIdHandler implements IQueryHandler<FindCustomerByIdQuery> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: FindCustomerByIdQuery): Promise<Customer> {
    // fetch the customer using the repo
    const fetchedCustomer: Customer | null =
      await this.customerRepository.findById(new CustomerIdVo(query.id));
    if (!fetchedCustomer) {
      throw new ApplicationException(
        'Such customer does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    return fetchedCustomer;
  }
}
