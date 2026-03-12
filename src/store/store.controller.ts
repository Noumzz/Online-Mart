import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { OwnerJwtGuard } from 'src/auth/owner-auth/owner-jwt.guard';
import { ProductsService } from 'src/products/products.service';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private productsService: ProductsService,
  ) {}
  @Post('create')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Get('get-products/:id')
  getAll(@Param('id') id) {
    return this.storeService.getAllProduct(id);
  }

  @UseGuards(OwnerJwtGuard)
  @Post('add-product/:id')
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Param('id') storeId,
    @Req() req,
  ) {
    const ownerId = req.user.id;
    return this.productsService.createProduct(
      ownerId,
      storeId,
      createProductDto,
    );
  }
}
