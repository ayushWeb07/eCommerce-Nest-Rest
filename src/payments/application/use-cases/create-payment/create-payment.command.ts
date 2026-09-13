import { Command } from '@nestjs/cqrs';

export interface CreatePaymentResponse {
  checkoutUrl: string;
  paymentId: string;
}

export class CreatePaymentCommand extends Command<CreatePaymentResponse> {
  constructor(
    public readonly orderId: string,
    public readonly successUrl?: string,
    public readonly cancelUrl?: string,
  ) {
    super();
  }
}
