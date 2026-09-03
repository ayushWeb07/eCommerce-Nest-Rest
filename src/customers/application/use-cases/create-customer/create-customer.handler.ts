import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './create-customer.command';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../ports/customer.repository.constants';
import type { CustomerRepository } from '../../ports/customer.repository.port';
import { EmailVo } from '../../../domain/value-objects/email.vo';
import { Customer } from '../../../domain/entities/customer.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<void> {
    // check if a customer with this email already exists
    const existingCustomer: Customer | null =
      await this.customerRepository.findByEmail(EmailVo.create(command.email));

    if (existingCustomer) {
      throw new ApplicationException(
        'User with such email already exists',
        ApplicationExceptionStatus.CONFLICT,
      );
    }

    // create the customer domain entity and wrap it with merge context, to make it capable of dispatching events
    const newCustomer = this.eventPublisher.mergeObjectContext(
      Customer.create(
        command.firstName,
        command.lastName,
        command.email,
        command.phone,
        command.isActive,
      ),
    );

    // create the customer using the customers repo
    await this.customerRepository.save(newCustomer);

    // finally dispatch all the outstanding events
    newCustomer.commit();
  }
}
