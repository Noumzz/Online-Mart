import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreOwner, Product])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
