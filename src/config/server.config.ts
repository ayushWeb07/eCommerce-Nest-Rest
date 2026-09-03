import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  serverPort: parseInt(process.env.SERVER_PORT ?? '8080', 10),
  nodemailerSmtpHost:
    process.env.NODEMAILER_SMTP_HOST ?? 'sandbox.smtp.mailtrap.io',
  nodemailerSmtpPort: parseInt(process.env.NODEMAILER_SMTP_PORT ?? '2525', 10),
  nodemailerSmtpUsername: process.env.NODEMAILER_SMTP_USERNAME ?? '',
  nodemailerSmtpPassword: process.env.NODEMAILER_SMTP_PASSWORD ?? '',
  nodemailerSmtpFrom: process.env.NODEMAILER_SMTP_FROM ?? '',
}));
