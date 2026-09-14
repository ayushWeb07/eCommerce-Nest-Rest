import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';

export type PaymentStatusValue = 'pending' | 'processing' | 'succeeded';

export const ValidPaymentStatuses: PaymentStatusValue[] = [
  'pending',
  'processing',
  'succeeded',
];

export class PaymentStatusVo {
  private constructor(private readonly value: PaymentStatusValue) {}

  static pending(): PaymentStatusVo {
    return new PaymentStatusVo('pending');
  }

  static processing(): PaymentStatusVo {
    return new PaymentStatusVo('processing');
  }

  static succeeded(): PaymentStatusVo {
    return new PaymentStatusVo('succeeded');
  }

  static fromString(value: string): PaymentStatusVo {
    if (!ValidPaymentStatuses.includes(value as PaymentStatusValue)) {
      throw new ApplicationException(
        `${value} is not a valid payment status`,
        ApplicationExceptionStatus.BAD_REQUEST,
      );
    }

    return new PaymentStatusVo(value as PaymentStatusValue);
  }

  getValue(): PaymentStatusValue {
    return this.value;
  }

  equals(other: PaymentStatusVo): boolean {
    return this.value === other.getValue();
  }
}
