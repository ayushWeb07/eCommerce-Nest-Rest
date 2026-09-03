import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './services/customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { FindCustomerByIdDto } from './dtos/find-customer-by-id.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { DeleteCustomerByIdDto } from './dtos/delete-customer-by-id.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    // call the create customer service
    await this.customersService.createCustomer(createCustomerDto);

    return {
      success: true,
      message: 'Successfully registered the new customer',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllProducts() {
    // call the find all customers service
    const fetchedCustomers: CreateCustomerDto[] =
      await this.customersService.findAllCustomers();

    return {
      success: true,
      message: 'Successfully fetched all the customers',
      data: fetchedCustomers,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findCustomerById(@Param() findCustomerByIdDto: FindCustomerByIdDto) {
    // call the find by id customer service
    const fetchedCustomer: CustomerResponseDto =
      await this.customersService.findCustomerById(findCustomerByIdDto);

    return {
      success: true,
      message: 'Successfully fetched the customer by id',
      data: fetchedCustomer,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCustomerById(
    @Param() deleteCustomerByIdDto: DeleteCustomerByIdDto,
  ) {
    // call the delete customer by id service
    await this.customersService.deleteCustomerById(deleteCustomerByIdDto);

    return {
      success: true,
      message: 'Successfully deleted the customer by id',
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateCustomer(@Body() updateCustomerDto: UpdateCustomerDto) {
    // call the update customer service
    await this.customersService.updateCustomer(updateCustomerDto);

    return {
      success: true,
      message: 'Successfully updated the customer by id',
    };
  }
}
