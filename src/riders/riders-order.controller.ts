import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RidersOrderService } from './riders-order.service';
import { RiderJwtAuthGuard } from 'src/auth/rider-auth/rider-jwt.auth.guard';

@UseGuards(RiderJwtAuthGuard)
@Controller('rider/order')
export class RiderOrderController {
  constructor(private ridersOrderService: RidersOrderService) {}
  @Get()
  availble(@Req() req) {
    console.log(req.user.riderId);
    return this.ridersOrderService.availbleOrder();
  }
  @Post('accept/:id')
  acceptOrder(@Param('id') id: number, @Req() req) {
    const riderId = req.user.riderId;
    console.log(riderId);
    return this.ridersOrderService.acceptOrder(id, riderId);
  }

  @Post('pick/:id')
  pickOrder(@Param('id') id: number, @Req() req) {
    const riderId = req.user.riderId;
    return this.ridersOrderService.pickOrder(id, riderId);
  }

  @Post('cancel/:id')
  cancelOrder(@Param('id') id: number, @Req() req) {
    const riderId = req.user.riderId;
    return this.ridersOrderService.cancelOrder(id, riderId);
  }

  @Post('deliver/:id')
  deliverOrder(@Param('id') id: number, @Req() req) {
    const riderId = req.user.riderId;
    return this.ridersOrderService.deliverOrder(id, riderId);
  }
}
