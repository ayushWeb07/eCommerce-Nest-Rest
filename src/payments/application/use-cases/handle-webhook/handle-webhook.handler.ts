import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { HandleWebhookCommand } from './handle-webhook.command';
import { Inject, Logger } from '@nestjs/common';
import { PAYMENT_GATEWAY_TOKEN } from '../../ports/payment-gateway.constants';
import type { PaymentGateway } from '../../ports/payment-gateway.port';
import { ConfigService } from '@nestjs/config';
import { IServerConfig } from '../../../../config/interfaces/server_config.interface';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import Stripe from 'stripe';
import { PAYMENT_REPOSITORY_TOKEN } from '../../ports/payment.repository.constants';
import type { PaymentRepository } from '../../ports/payment.repository.port';
import { PaymentIdVo } from '../../../domain/value-objects/payment-id.vo';
import { Payment } from '../../../domain/entities/payment.entity';

@CommandHandler(HandleWebhookCommand)
export class HandleWebhookHandler implements ICommandHandler<HandleWebhookCommand> {
  private serverConfig: IServerConfig;

  private logger: Logger = new Logger(HandleWebhookHandler.name, {
    timestamp: true,
  });

  constructor(
    private readonly configService: ConfigService,

    private readonly eventPublisher: EventPublisher,

    @Inject(PAYMENT_GATEWAY_TOKEN)
    private readonly paymentGateway: PaymentGateway,

    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) {
    // get the server config
    const serverConfig = this.configService.get<IServerConfig>('server');

    if (!serverConfig) {
      throw new ApplicationException(
        'Server configuration must be setup',
        ApplicationExceptionStatus.INTERNAL_SERVER,
      );
    }

    this.serverConfig = serverConfig;
  }

  async execute(command: HandleWebhookCommand): Promise<void> {
    // call the construct webhook event
    const event = await this.paymentGateway.constructWebhookEvent(
      command.payload,
      command.signature,
    );

    const stripeEvent = event as Stripe.Event;

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;

        // grab the payment id and the gateway transaction id
        const paymentId: string | undefined = session.metadata?.paymentId;
        const transactionId: string | null = session.payment_intent
          ? typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id
          : null;

        if (paymentId && transactionId) {
          // fetch the payment from the db
          const existingPayment: Payment | null =
            await this.paymentRepository.findPaymentById(
              new PaymentIdVo(paymentId),
            );

          if (!existingPayment) {
            throw new ApplicationException(
              'Such payment does not exist',
              ApplicationExceptionStatus.NOT_FOUND,
            );
          }

          // check if its already succeeded
          if (existingPayment.isSucceeded()) {
            return;
          }

          // track the payment via the event publisher
          const trackedPayment =
            this.eventPublisher.mergeObjectContext(existingPayment);

          // mark it as completed and update the transaction id
          trackedPayment.complete(transactionId);

          // update the payment inside the database
          await this.paymentRepository.updatePayment(trackedPayment);

          trackedPayment.commit();
        }

        break;
      }

      default:
        break;
    }

    this.logger.log(event);
  }
}
