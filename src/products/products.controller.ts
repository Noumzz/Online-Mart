import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { OwnerJwtGuard } from 'src/auth/owner-auth/owner-jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('get-all')
  getAll() {
    return this.productsService.getAll(3);
  }
}
