import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';
import { RidersController } from './riders/riders.controller';
import { RidersService } from './riders/riders.service';
import { RidersModule } from './riders/riders.module';
import { MartOwnerController } from './store-owner/store-owner.controller';
import { MartOwnerModule } from './store-owner/store-owner.module';
import { MartOwnerService } from './store-owner/store-owner.service';
import { UsersController } from './users/users.controller';
import { ProductsModule } from './products/products.module';
import { StoreModule } from './store/store.module';
import { OrderItemModule } from './orders/order.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    RidersModule,
    MartOwnerModule,
    ProductsModule,
    StoreModule,
    OrderItemModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
