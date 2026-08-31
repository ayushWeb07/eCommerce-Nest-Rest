import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApplicationExceptionFilter } from './shared/infrastructure/filters/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use api prefix
  app.setGlobalPrefix('api/v1');

  // register the validation filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // register the global exception filter
  app.useGlobalFilters(new ApplicationExceptionFilter());

  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
