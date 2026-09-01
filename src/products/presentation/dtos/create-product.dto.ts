import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(300)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(200)
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(15, 15, { message: 'Product sku must be exactly 15 characters long' })
  sku: string;

  @IsDefined()
  @IsInt()
  @Min(1)
  priceAmount: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, {
    message: 'Product price currency must be exactly 3 characters long',
  })
  priceCurrency: string;

  @IsDefined()
  @IsInt()
  @Min(0)
  stock: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  lowStockThreshold: number;

  @IsDefined()
  @IsBoolean()
  isAvailable: boolean;
}
