import {
  INotificationProps,
  NotificationPort,
} from '../../application/ports/notification.port';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
class ConsoleLoggerNotification implements NotificationPort {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(ConsoleLoggerNotification.name, {
      timestamp: true,
    });
  }

  sendNotification(props: INotificationProps): void {
    this.logger.log(
      `to: ${props.recipient} | subject: ${props.subject} | message: ${props.message}`,
    );
  }
}

export default ConsoleLoggerNotification;
