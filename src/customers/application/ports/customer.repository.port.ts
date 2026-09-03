import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdVo } from '../../domain/value-objects/customer-id.vo';
import { EmailVo } from '../../domain/value-objects/email.vo';

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findAll(): Promise<Customer[]>;
  findById(customerId: CustomerIdVo): Promise<Customer | null>;
  findByEmail(email: EmailVo): Promise<Customer | null>;
  deleteById(customerId: CustomerIdVo): Promise<void>;
  update(customer: Customer): Promise<void>;
}
