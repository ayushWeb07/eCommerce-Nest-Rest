export interface INotificationProps {
  recipient: string;
  subject: string;
  message: string;
}

export interface NotificationPort {
  sendNotification(props: INotificationProps): void;
}
