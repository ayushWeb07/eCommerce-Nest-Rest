import type { PaymentRepository } from '../application/ports/payment.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../domain/entities/payment.entity';
import { SelectPaymentType } from '../../shared/infrastructure/database/drizzle/types/payment.type';
import { PaymentIdVo } from '../domain/value-objects/payment-id.vo';
import { PaymentStatusVo } from '../domain/value-objects/payment-status.vo';
import { MoneyVo } from '../../shared/domain/value-objects/money.vo';
import { DRIZZLE_PROVIDER_TOKEN } from '../../shared/infrastructure/database/drizzle/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../shared/infrastructure/database/drizzle/schemas';
import { payments } from '../../shared/infrastructure/database/drizzle/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
class DrizzlePaymentRepository implements PaymentRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async savePayment(payment: Payment): Promise<void> {
    // convert the payment to drizzle schema
    const paymentDrizzleRow: SelectPaymentType =
      DrizzlePaymentRepository.toPaymentDrizzleSchema(payment);

    // insert the payment into the db
    await this.db.insert(payments).values(paymentDrizzleRow);
  }

  async findPaymentByOrderId(orderId: string): Promise<Payment | null> {
    // query the payment from the db
    const [existingPayment] = await this.db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));

    if (!existingPayment) {
      return null;
    }

    return DrizzlePaymentRepository.toPaymentDomainEntity(existingPayment);
  }

  private static toPaymentDrizzleSchema(payment: Payment): SelectPaymentType {
    return {
      id: payment.id.getValue(),
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      status: payment.status.getValue(),
      orderId: payment.orderId,
      payableAmount: payment.payableAmount.getAmount(),
      payableAmountCurrency: payment.payableAmount.getCurrency(),
      transactionId: payment.transactionId,
    };
  }

  private static toPaymentDomainEntity(row: SelectPaymentType): Payment {
    // create the payment id vo
    const paymentIdVo = new PaymentIdVo(row.id);

    // create payment status vo
    const paymentStatusVo = PaymentStatusVo.fromString(row.status);

    // create the payable amount vo
    const payableAmountVo = MoneyVo.create(
      row.payableAmount,
      row.payableAmountCurrency,
    );

    return Payment.reconstitute({
      id: paymentIdVo,
      orderId: row.orderId,
      status: paymentStatusVo,
      payableAmount: payableAmountVo,
      transactionId: row.transactionId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

export default DrizzlePaymentRepository;
