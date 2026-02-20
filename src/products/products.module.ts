import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { Store } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StoreOwner, Store])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
