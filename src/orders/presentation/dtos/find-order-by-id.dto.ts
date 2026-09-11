import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindOrderByIdDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
