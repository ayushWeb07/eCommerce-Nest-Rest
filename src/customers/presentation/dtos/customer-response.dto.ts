import { Customer } from '../../domain/entities/customer.entity';

export class CustomerResponseDto {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  static fromDomainEntity(customer: Customer): CustomerResponseDto {
    // create the dto entity and assign corresponding properties
    const customerDto = new CustomerResponseDto();

    customerDto.id = customer.id.getValue();
    customerDto.firstName = customer.firstName;
    customerDto.lastName = customer.lastName;
    customerDto.email = customer.email.getValue();
    customerDto.phone = customer.phone;
    customerDto.isActive = customer.isActive;
    customerDto.createdAt = customer.createdAt.toISOString();
    customerDto.updatedAt = customer.updatedAt.toISOString();

    return customerDto;
  }
}
