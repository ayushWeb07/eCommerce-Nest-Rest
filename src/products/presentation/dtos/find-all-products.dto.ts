import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllProductsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  minPrice?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  maxPrice?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
