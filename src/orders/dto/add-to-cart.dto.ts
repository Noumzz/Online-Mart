import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  cart: number;
}
