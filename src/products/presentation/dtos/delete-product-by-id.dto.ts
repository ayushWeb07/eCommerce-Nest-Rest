import { IsString, IsUUID } from 'class-validator';

export class DeleteProductByIdDto {
  @IsString()
  @IsUUID()
  id: string;
}
