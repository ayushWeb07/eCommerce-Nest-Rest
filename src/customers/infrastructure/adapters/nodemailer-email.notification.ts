import {
  INotificationProps,
  NotificationPort,
} from '../../application/ports/notification.port';
import { Inject, Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IServerConfig } from '../../../config/interfaces/server_config.interface';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../application/ports/customer.repository.constants';
import type { CustomerRepository } from '../../application/ports/customer.repository.port';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdVo } from '../../domain/value-objects/customer-id.vo';

import type { Transporter } from 'nodemailer';

@Injectable()
class NodemailerEmailNotification implements NotificationPort {
  private logger: Logger = new Logger(NodemailerEmailNotification.name, {
    timestamp: true,
  });

  private transport: Transporter;

  private fromEmail: string;

  constructor(
    private readonly configService: ConfigService,

    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,
  ) {
    // get the server config
    const serverConfig = configService.get<IServerConfig>('server');

    if (!serverConfig) {
      throw new ApplicationException(
        'Server configuration must be setup',
        ApplicationExceptionStatus.INTERNAL_SERVER,
      );
    }

    // instantiate the nodemailer transport
    this.transport = nodemailer.createTransport({
      host: serverConfig.nodemailerSmtpHost,
      port: serverConfig.nodemailerSmtpPort,
      auth: {
        user: serverConfig.nodemailerSmtpUsername,
        pass: serverConfig.nodemailerSmtpPassword,
      },
    });

    this.fromEmail = serverConfig.nodemailerSmtpFrom;
  }

  async sendNotification(props: INotificationProps): Promise<void> {
    // fetch the customer using the repo
    const fetchedCustomer: Customer | null =
      await this.customerRepository.findById(
        new CustomerIdVo(props.customerId),
      );

    if (!fetchedCustomer) {
      throw new ApplicationException(
        'Could not find such customer',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // send the email using nodemailer
    await this.transport.sendMail({
      from: this.fromEmail,
      to: fetchedCustomer.email.getValue(),
      subject: props.subject,
      text: props.message,
    });

    this.logger.log(
      `Successfully sent email to customer with email: ${fetchedCustomer.email.getValue()}`,
    );
  }
}

export default NodemailerEmailNotification;
