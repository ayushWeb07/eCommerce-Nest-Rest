import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '../../shared/infrastructure/database/drizzle/drizzle.module';
import { CUSTOMER_REPOSITORY_TOKEN } from '../application/ports/customer.repository.constants';
import DrizzleCustomerRepository from '../infrastructure/adapters/drizzle-customer.repository';
import { CreateCustomerHandler } from '../application/use-cases/create-customer/create-customer.handler';
import { FindAllCustomersHandler } from '../application/use-cases/find-all-customers/find-all-customers.handler';
import { FindCustomerByIdHandler } from '../application/use-cases/find-customer-by-id/find-customer-by-id.handler';
import { UpdateCustomerHandler } from '../application/use-cases/update-customer/update-customer.handler';
import { DeleteCustomerByIdHandler } from '../application/use-cases/delete-customer-by-id/delete-customer-by-id.handler';
import { CustomersController } from './customers.controller';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [CustomersController],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY_TOKEN,
      useClass: DrizzleCustomerRepository,
    },

    CustomersService,
    CreateCustomerHandler,
    FindAllCustomersHandler,
    FindCustomerByIdHandler,
    UpdateCustomerHandler,
    DeleteCustomerByIdHandler,
  ],
})
export class CustomersModule {}
