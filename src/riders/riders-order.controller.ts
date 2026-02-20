import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RidersOrderService } from './riders-order.service';
import { RiderJwtAuthGuard } from 'src/auth/rider-auth/rider-jwt.auth.guard';

@UseGuards(RiderJwtAuthGuard)
@Controller('rider/order')
export class RiderOrderController {
  constructor(private ridersOrderService: RidersOrderService) {}
  @Get()
  availble() {
    return this.ridersOrderService.availbleOrder();
  }
  @Post('accept/:id')
  acceptOrder(@Param('id') id: number) {
    console.log(id);
    return this.ridersOrderService.acceptOrder(id, 1);
  }

  @Post('pick/:id')
  pickOrder(@Param('id') id: number) {
    return this.ridersOrderService.pickOrder(1, id);
  }

  @Post('cancel/:id')
  cancelOrder(@Param('id') id: number) {
    return this.ridersOrderService.cancelOrder(1, id);
  }

  @Post('deliver/:id')
  deliverOrder(@Param('id') id: number) {
    return this.ridersOrderService.deliverOrder(1, id);
  }
}
