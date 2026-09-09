import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindAllOrdersByCustomerIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  customerId: string;
}
