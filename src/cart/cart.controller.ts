import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  getCart(@Param('id') id: number) {
    return this.cartService.getCart(id);
  }

  @Post('checkout/:id')
  checkOut(@Param('id') id: number, @Body() dto: CheckoutDto) {
    return this.cartService.checkOut(id, dto.confirmPrice);
  }
}
