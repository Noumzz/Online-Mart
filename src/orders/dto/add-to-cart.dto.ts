import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  cart: number;
}
