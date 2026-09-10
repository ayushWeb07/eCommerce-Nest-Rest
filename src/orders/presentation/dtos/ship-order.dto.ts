import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ShipOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(25)
  @MaxLength(255)
  trackingId: string;
}
