import { Inject, Injectable } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../../customers/application/ports/customer.repository.constants';
import type { CustomerRepository } from '../../../customers/application/ports/customer.repository.port';
import { CustomerPort } from '../../application/ports/customer.port';
import { Customer } from '../../../customers/domain/entities/customer.entity';
import { CustomerIdVo } from '../../../customers/domain/value-objects/customer-id.vo';

@Injectable()
class CustomerAdapter implements CustomerPort {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async checkIfExists(customerId: string): Promise<boolean> {
    const fetchedCustomer: Customer | null =
      await this.customerRepository.findById(new CustomerIdVo(customerId));

    return fetchedCustomer !== null;
  }
}

export default CustomerAdapter;
