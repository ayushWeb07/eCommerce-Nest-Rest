import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  RawBody,
  Headers,
} from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CreatePaymentResponse } from '../application/use-cases/create-payment/create-payment.command';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    // call the create payment service
    const paymentResponse: CreatePaymentResponse =
      await this.paymentsService.createPayment(createPaymentDto);

    return {
      success: true,
      message: 'Successfully created the new payment',
      data: { ...paymentResponse },
    };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    // call the handle webhook service
    await this.paymentsService.handleWebhook(payload, signature);

    return {
      success: true,
      message: 'Successfully triggered the webhook',
    };
  }
}
