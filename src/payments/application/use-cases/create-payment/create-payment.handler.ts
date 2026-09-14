import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
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
import { ORDER_PRICING_TOKEN } from '../../ports/order-pricing.constants';
import type {
  OrderPricing,
  OrderPricingPort,
} from '../../ports/order-pricing.port';
import { PAYMENT_GATEWAY_TOKEN } from '../../ports/payment-gateway.constants';
import type {
  CreateCheckoutSessionResult,
  PaymentGateway,
} from '../../ports/payment-gateway.port';
import { OrderIdVo } from '../../../../orders/domain/value-objects/order-id.vo';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,

    @Inject(ORDER_PRICING_TOKEN)
    private readonly orderPricingPort: OrderPricingPort,

    @Inject(PAYMENT_GATEWAY_TOKEN)
    private readonly paymentGateway: PaymentGateway,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResponse> {
    // find the payment by order id
    const existingPayment: Payment | null =
      await this.paymentRepository.findPaymentByOrderId(command.orderId);

    if (existingPayment?.isSucceeded()) {
      throw new ApplicationException(
        'Payment for such order has already been made',
        ApplicationExceptionStatus.CONFLICT,
      );
    }

    // get the order pricing details
    const fetchedOrderPricing: OrderPricing | null =
      await this.orderPricingPort.getOrderPricing(command.orderId);

    if (!fetchedOrderPricing) {
      throw new ApplicationException(
        'Such order does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // track the payment by either use the existing or creating a new one
    let payment: Payment;

    if (existingPayment) {
      payment = this.eventPublisher.mergeObjectContext(existingPayment);
    } else {
      payment = this.eventPublisher.mergeObjectContext(
        Payment.create(
          command.orderId,
          fetchedOrderPricing.totalAmount.getAmount(),
          fetchedOrderPricing.totalAmount.getCurrency(),
        ),
      );
    }

    // initiate a payment through the payment gateway
    const newCheckoutPayment: CreateCheckoutSessionResult =
      await this.paymentGateway.createCheckoutSession(
        fetchedOrderPricing.items,
        {
          orderId: new OrderIdVo(command.orderId),
          paymentId: payment.id,
        },
        {
          successUrl: command.successUrl,
          cancelUrl: command.cancelUrl,
        },
      );

    // update the status of the payment
    if (payment.isSucceeded()) {
      throw new ApplicationException(
        'Payment for such order has already been made',
        ApplicationExceptionStatus.CONFLICT,
      );
    } else {
      payment.startCheckout();
    }

    // insert the payment into the database
    await this.paymentRepository.savePayment(payment);

    // finally dispatch all the outstanding events
    payment.commit();

    return {
      checkoutUrl: newCheckoutPayment.url,
      paymentId: payment.id.getValue(),
    };
  }
}
