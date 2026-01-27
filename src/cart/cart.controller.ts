import { Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  getCart(@Param('id') id: number) {
    return this.cartService.getCart(id);
  }

  @Post('checkout/:id')
  checkOut(@Param('id') id: number) {
    return this.cartService.checkOut(id);
  }
}
