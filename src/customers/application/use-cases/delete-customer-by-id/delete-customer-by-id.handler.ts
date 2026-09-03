import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerByIdCommand } from './delete-customer-by-id.command';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../ports/customer.repository.constants';
import type { CustomerRepository } from '../../ports/customer.repository.port';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { CustomerIdVo } from '../../../domain/value-objects/customer-id.vo';
import { Customer } from '../../../domain/entities/customer.entity';

@CommandHandler(DeleteCustomerByIdCommand)
export class DeleteCustomerByIdHandler implements ICommandHandler<DeleteCustomerByIdCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: DeleteCustomerByIdCommand): Promise<void> {
    const customerId = new CustomerIdVo(command.id);

    // check if a customer with this id already exists
    const existingCustomer: Customer | null =
      await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new ApplicationException(
        'Customer with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // delete the customer using the customers repo
    await this.customerRepository.deleteById(customerId);
  }
}
