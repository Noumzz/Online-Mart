import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { OrderItemService } from './order.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}
  @Post('add')
  addItem(@Body() orderItemDto: AddToCartDto) {
    return this.orderItemService.addToCart(orderItemDto);
  }
}
