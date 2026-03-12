import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;
}
