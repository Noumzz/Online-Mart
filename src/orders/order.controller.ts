import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { OrderService } from './order.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderService: OrderService) {}
  @Get()
  get() {
    return 'Hello World';
  }
  @Post('add')
  addItem(@Body() orderItemDto: AddToCartDto) {
    return this.orderService.addToCart(orderItemDto);
  }
  @Get('status/:id')
  getStatus(@Param('id') id: number) {
    return this.orderService.orderStatus(id);
  }
}
