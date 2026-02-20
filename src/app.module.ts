import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from 'db/data-source';
import { RidersModule } from './riders/riders.module';
import { MartOwnerModule } from './store-owner/store-owner.module';
import { ProductsModule } from './products/products.module';
import { StoreModule } from './store/store.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrderItemModule } from './orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    RidersModule,
    MartOwnerModule,
    ProductsModule,
    StoreModule,
    OrderItemModule,
    CartModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
