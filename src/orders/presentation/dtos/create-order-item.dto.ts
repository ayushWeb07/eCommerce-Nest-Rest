import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(300)
  productName: string;

  @IsDefined()
  @IsInt()
  @Min(1)
  unitPriceAmount: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, {
    message: 'Product price currency must be exactly 3 characters long',
  })
  unitPriceCurrency: string;

  @IsDefined()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  discountAmount?: number;
}
