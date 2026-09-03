import { IsString, IsUUID } from 'class-validator';

export class FindCustomerByIdDto {
  @IsString()
  @IsUUID()
  id: string;
}
