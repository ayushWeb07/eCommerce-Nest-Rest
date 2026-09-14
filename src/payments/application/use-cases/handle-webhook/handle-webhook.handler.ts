import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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

@CommandHandler(HandleWebhookCommand)
export class HandleWebhookHandler implements ICommandHandler<HandleWebhookCommand> {
  private serverConfig: IServerConfig;

  private logger: Logger = new Logger(HandleWebhookHandler.name, {
    timestamp: true,
  });

  constructor(
    private readonly configService: ConfigService,

    @Inject(PAYMENT_GATEWAY_TOKEN)
    private readonly paymentGateway: PaymentGateway,
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
    const webhookResponse = await this.paymentGateway.constructWebhookEvent(
      command.payload,
      command.signature,
    );

    this.logger.log(webhookResponse);
  }
}
