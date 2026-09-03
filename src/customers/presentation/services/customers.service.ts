import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../../application/use-cases/create-customer/create-customer.command';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { FindAllCustomersQuery } from '../../application/use-cases/find-all-customers/find-all-customers.query';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { FindCustomerByIdDto } from '../dtos/find-customer-by-id.dto';
import { FindCustomerByIdQuery } from '../../application/use-cases/find-customer-by-id/find-customer-by-id.query';
import { DeleteCustomerByIdDto } from '../dtos/delete-customer-by-id.dto';
import { DeleteCustomerByIdCommand } from '../../application/use-cases/delete-customer-by-id/delete-customer-by-id.command';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateCustomerCommand } from '../../application/use-cases/update-customer/update-customer.command';

@Injectable()
export class CustomersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<void> {
    // execute the create customer command
    await this.commandBus.execute(
      new CreateCustomerCommand(
        createCustomerDto.firstName,
        createCustomerDto.lastName,
        createCustomerDto.email,
        createCustomerDto.phone,
        createCustomerDto.isActive,
      ),
    );
  }

  async findAllCustomers(): Promise<CustomerResponseDto[]> {
    // execute the find all customers query
    const fetchedCustomers: Customer[] = await this.queryBus.execute(
      new FindAllCustomersQuery(),
    );

    // convert them from customer entities to customer response dto
    return fetchedCustomers.map((cust: Customer): CustomerResponseDto =>
      CustomerResponseDto.fromDomainEntity(cust),
    );
  }

  async findCustomerById(
    findCustomerByIdDto: FindCustomerByIdDto,
  ): Promise<CustomerResponseDto> {
    // execute the find customer by id query
    const fetchedCustomer: Customer = await this.queryBus.execute(
      new FindCustomerByIdQuery(findCustomerByIdDto.id),
    );

    // convert them from Customer entity to Customer response dto
    return CustomerResponseDto.fromDomainEntity(fetchedCustomer);
  }

  async updateCustomer(updateCustomerDto: UpdateCustomerDto): Promise<void> {
    // execute the update customer command
    await this.commandBus.execute(
      new UpdateCustomerCommand(
        updateCustomerDto.id,
        updateCustomerDto?.firstName,
        updateCustomerDto?.lastName,
        updateCustomerDto?.phone,
        updateCustomerDto?.isActive,
      ),
    );
  }

  async deleteCustomerById(
    deleteCustomerByIdDto: DeleteCustomerByIdDto,
  ): Promise<void> {
    // execute the delete customer command
    await this.commandBus.execute(
      new DeleteCustomerByIdCommand(deleteCustomerByIdDto.id),
    );
  }
}
