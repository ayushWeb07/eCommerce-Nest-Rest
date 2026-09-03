import { IsString, IsUUID } from 'class-validator';

export class DeleteCustomerByIdDto {
  @IsString()
  @IsUUID()
  id: string;
}
