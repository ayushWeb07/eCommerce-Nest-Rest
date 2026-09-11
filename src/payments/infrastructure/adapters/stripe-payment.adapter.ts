import {
  CheckoutItem,
  CheckoutSessionMetadata,
  CheckoutUrls,
  CreateCheckoutSessionResult,
  PaymentGateway,
} from '../../application/ports/payment-gateway.port';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { IServerConfig } from '../../../config/interfaces/server_config.interface';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';

@Injectable()
class StripePaymentAdapter implements PaymentGateway {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    // get the server config
    const serverConfig = configService.get<IServerConfig>('server');

    if (!serverConfig) {
      throw new ApplicationException(
        'Server configuration must be setup',
        ApplicationExceptionStatus.INTERNAL_SERVER,
      );
    }

    // instantiate the strip
    this.stripe = new Stripe(serverConfig.stripeTestKey);
  }

  async createCheckoutSession(
    items: CheckoutItem[],
    metadata: CheckoutSessionMetadata,
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult> {
    // consturct the line items
    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: item.price.getCurrency().toLowerCase(),
        unit_amount: item.price.getAmount() * 100,

        product_data: {
          name: item.productName,
          description: item.productDescription,
          metadata: { sku: item.productSku.getValue() },
        },
      },

      quantity: item.quantity,
    }));

    // create the stripe checkout session
    const newCheckoutSession = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: urls?.successUrl,
      cancel_url: urls?.cancelUrl,
      metadata: {
        orderId: metadata.orderId.getValue(),
        paymentId: metadata.paymentId.getValue(),
      },
    });

    return {
      sessionId: newCheckoutSession.id,
      url: newCheckoutSession.url!,
    };
  }

  constructWebhookEvent(payload: Buffer, signature: string): any {
    // get the server config
    const serverConfig = this.configService.get<IServerConfig>('server')!;

    // construct the webhook event
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      serverConfig.stripeTestKey,
    );
  }
}

export default StripePaymentAdapter;
