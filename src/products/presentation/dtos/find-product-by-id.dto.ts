import { IsString, IsUUID } from 'class-validator';

export class FindProductByIdDto {
  @IsString()
  @IsUUID()
  id: string;
}
