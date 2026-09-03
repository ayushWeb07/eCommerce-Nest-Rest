import { CustomerRepository } from '../../application/ports/customer.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER_TOKEN } from '../../../shared/infrastructure/database/drizzle/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../shared/infrastructure/database/drizzle/schemas';
import { Customer } from 'src/customers/domain/entities/customer.entity';
import { CustomerIdVo } from 'src/customers/domain/value-objects/customer-id.vo';
import { EmailVo } from 'src/customers/domain/value-objects/email.vo';
import { customers } from '../../../shared/infrastructure/database/drizzle/schemas';
import { SelectCustomerType } from '../../../shared/infrastructure/database/drizzle/types/customer.type';
import { eq } from 'drizzle-orm';

@Injectable()
class DrizzleCustomerRepository implements CustomerRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async save(customer: Customer): Promise<void> {
    // insert the customer into the db
    await this.db
      .insert(customers)
      .values(DrizzleCustomerRepository.toDrizzleSchema(customer));
  }

  async findAll(): Promise<Customer[]> {
    // query the customers from the db
    const fetchedCustomers: SelectCustomerType[] = await this.db
      .select()
      .from(customers);

    // convert the drizzle rows to domain entity
    return fetchedCustomers.map((row: SelectCustomerType): Customer =>
      DrizzleCustomerRepository.toDomainEntity(row),
    );
  }

  async findById(customerId: CustomerIdVo): Promise<Customer | null> {
    // query the customer from the db
    const [fetchedCustomer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId.getValue()));

    if (!fetchedCustomer) return null;

    return DrizzleCustomerRepository.toDomainEntity(fetchedCustomer);
  }

  async findByEmail(email: EmailVo): Promise<Customer | null> {
    // query the customer from the db
    const [fetchedCustomer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email.getValue()));

    if (!fetchedCustomer) return null;

    return DrizzleCustomerRepository.toDomainEntity(fetchedCustomer);
  }

  async deleteById(customerId: CustomerIdVo): Promise<void> {
    // delete the customer from the db
    await this.db
      .delete(customers)
      .where(eq(customers.id, customerId.getValue()));
  }

  async update(customer: Customer): Promise<void> {
    // update the customer from the db
    await this.db
      .update(customers)
      .set(DrizzleCustomerRepository.toDrizzleSchema(customer))
      .where(eq(customers.id, customer.id.getValue()));
  }

  private static toDrizzleSchema(customer: Customer): SelectCustomerType {
    return {
      id: customer.id.getValue(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.getValue(),
      phone: customer.phone,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private static toDomainEntity(row: SelectCustomerType): Customer {
    // craft the customer id vo
    const customerId = new CustomerIdVo(row.id);

    // craft the email vo
    const emailVo = EmailVo.create(row.email);

    return Customer.reconstitute({
      id: customerId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: emailVo,
      phone: row.phone,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

export default DrizzleCustomerRepository;
