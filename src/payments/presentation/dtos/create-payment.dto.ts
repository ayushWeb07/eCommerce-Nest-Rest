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

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  successUrl: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  cancelUrl?: string;
}
