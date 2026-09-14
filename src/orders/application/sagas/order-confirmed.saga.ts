import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { PaymentCompletedEvent } from '../../../payments/domain/events/payment-completed.event';
import { ConfirmOrderCommand } from '../use-cases/confirm-order/confirm-order.command';

@Injectable()
export class OrderConfirmedSaga {
  @Saga()
  paymentConfirmed = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentCompletedEvent),
      map(
        (event: PaymentCompletedEvent): ConfirmOrderCommand =>
          new ConfirmOrderCommand(event.orderId),
      ),
    );
  };
}
