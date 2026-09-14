import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { CreatePaymentCommand } from '../../application/use-cases/create-payment/create-payment.command';

@Injectable()
export class PaymentsService {
  constructor(private readonly commandBus: CommandBus) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<void> {
    // execute the create payment command
    await this.commandBus.execute(
      new CreatePaymentCommand(
        createPaymentDto.orderId,
        createPaymentDto?.successUrl,
        createPaymentDto?.cancelUrl,
      ),
    );
  }
}
