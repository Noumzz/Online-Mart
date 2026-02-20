import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { RidersController } from './riders.controller';
import { RidersService } from './riders.service';
import { AuthModule } from 'src/auth/auth.module';
import { RiderOrderController } from './riders-order.controller';
import { RidersOrderService } from './riders-order.service';
import { Order } from 'src/orders/order.entity';
import { OrderItemModule } from 'src/orders/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rider, Order]),
    forwardRef(() => AuthModule),
    OrderItemModule,
  ],
  controllers: [RidersController, RiderOrderController],
  providers: [RidersService, RidersOrderService],
  exports: [RidersService, RidersOrderService],
})
export class RidersModule {}
