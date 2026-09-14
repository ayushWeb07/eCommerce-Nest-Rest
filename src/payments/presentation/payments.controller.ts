import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(createPaymentDto: CreatePaymentDto) {
    // call the create payment service
    await this.paymentsService.createPayment(createPaymentDto);

    return {
      success: true,
      message: 'Successfully created the new payment',
    };
  }
}
