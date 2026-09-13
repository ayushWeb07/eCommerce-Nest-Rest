import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreatePaymentCommand,
  CreatePaymentResponse,
} from './create-payment.command';
import { Inject } from '@nestjs/common';
import { PAYMENT_REPOSITORY_TOKEN } from '../../ports/payment.repository.constants';
import type { PaymentRepository } from '../../ports/payment.repository.port';
import { Payment } from '../../../domain/entities/payment.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    // find the payment by order id
    const fetchedPayment: Payment | null =
      await this.paymentRepository.findPaymentByOrderId(command.orderId);

    if (fetchedPayment?.isSucceeded()) {
      throw new ApplicationException(
        'Payment for such order has already been made',
        ApplicationExceptionStatus.CONFLICT,
      );
    }
  }
}
