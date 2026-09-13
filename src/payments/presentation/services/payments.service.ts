import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {}
}