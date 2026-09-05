import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export type OrderStatusValue =
  'pending' | 'cancelled' | 'confirmed' | 'shipped' | 'delivered';

export const ValidOrderStatuses: OrderStatusValue[] = [
  'pending',
  'cancelled',
  'confirmed',
  'shipped',
  'delivered',
];

export class OrderStatusVo {
  private static VALID_TRANSISITONS: Record<
    OrderStatusValue,
    OrderStatusValue[]
  > = {
    pending: ['cancelled', 'confirmed'],
    cancelled: [],
    confirmed: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
  };

  private constructor(private readonly value: OrderStatusValue) {}

  static pending(): OrderStatusVo {
    return new OrderStatusVo('pending');
  }

  static cancelled(): OrderStatusVo {
    return new OrderStatusVo('cancelled');
  }

  static confirmed(): OrderStatusVo {
    return new OrderStatusVo('confirmed');
  }

  static shipped(): OrderStatusVo {
    return new OrderStatusVo('shipped');
  }

  static delivered(): OrderStatusVo {
    return new OrderStatusVo('delivered');
  }

  static fromString(value: string): OrderStatusVo {
    if (!ValidOrderStatuses.includes(value as OrderStatusValue)) {
      throw new DomainException(`${value} is not a valid order status`);
    }

    return new OrderStatusVo(value as OrderStatusValue);
  }

  canCancel(): boolean {
    return this.canTransitionTo('cancelled');
  }

  canConfirm(): boolean {
    return this.canTransitionTo('confirmed');
  }

  canShip(): boolean {
    return this.canTransitionTo('shipped');
  }

  canDeliver(): boolean {
    return this.canTransitionTo('delivered');
  }

  private canTransitionTo(target: OrderStatusValue): boolean {
    const validTransitions: OrderStatusValue[] =
      OrderStatusVo.VALID_TRANSISITONS[this.value];

    return validTransitions.includes(target);
  }

  transitionToCancelled(): OrderStatusVo {
    return this.transitionTo('cancelled');
  }

  transitionToConfirmed(): OrderStatusVo {
    return this.transitionTo('confirmed');
  }

  transitionToShipped(): OrderStatusVo {
    return this.transitionTo('shipped');
  }

  transitionToDelivered(): OrderStatusVo {
    return this.transitionTo('delivered');
  }

  private transitionTo(target: OrderStatusValue): OrderStatusVo {
    if (!this.canTransitionTo(target)) {
      throw new DomainException(
        `Invalid order status transition from ${this.value} to ${target}`,
      );
    }

    return new OrderStatusVo(target);
  }

  getValue(): OrderStatusValue {
    return this.value;
  }

  equals(other: OrderStatusVo): boolean {
    return this.value === other.getValue();
  }
}
