import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './update-customer.command';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../ports/customer.repository.constants';
import type { CustomerRepository } from '../../ports/customer.repository.port';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { CustomerIdVo } from '../../../domain/value-objects/customer-id.vo';
import { Customer } from '../../../domain/entities/customer.entity';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customerId = new CustomerIdVo(command.id);

    // check if a customer with this id exist
    const existingCustomer: Customer | null =
      await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new ApplicationException(
        'Customer with such id does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // create the customer domain entity
    const customerToBeUpdated = Customer.create(
      command.firstName ?? existingCustomer.firstName,
      command.lastName ?? existingCustomer.lastName,
      existingCustomer.email.getValue(),
      command.phone ?? existingCustomer.phone,
      command.isActive ?? existingCustomer.isActive,
      command.id,
    );

    // update the customer using the products repo
    await this.customerRepository.update(customerToBeUpdated);
  }
}
