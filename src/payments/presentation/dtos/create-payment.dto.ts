import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  successUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  cancelUrl?: string;
}
