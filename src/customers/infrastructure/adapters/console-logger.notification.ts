import {
  INotificationProps,
  NotificationPort,
} from '../../application/ports/notification.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../application/ports/customer.repository.constants';
import type { CustomerRepository } from '../../application/ports/customer.repository.port';
import { CustomerIdVo } from '../../domain/value-objects/customer-id.vo';
import { Customer } from '../../domain/entities/customer.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';

@Injectable()
class ConsoleLoggerNotification implements NotificationPort {
  private logger: Logger = new Logger(ConsoleLoggerNotification.name, {
    timestamp: true,
  });

  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async sendNotification(props: INotificationProps): Promise<void> {
    // fetch the customer using the repo
    const fetchedCustomer: Customer | null =
      await this.customerRepository.findById(
        new CustomerIdVo(props.customerId),
      );

    if (!fetchedCustomer) {
      throw new ApplicationException(
        'Such customer does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    this.logger.log(
      `to: ${fetchedCustomer.email.getValue()} | subject: ${props.subject} | message: ${props.message}`,
    );
  }
}

export default ConsoleLoggerNotification;
