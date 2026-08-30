import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  serverPort: parseInt(process.env.SERVER_PORT ?? '8080', 10),
}));
