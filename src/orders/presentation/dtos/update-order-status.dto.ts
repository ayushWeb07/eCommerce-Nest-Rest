import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
