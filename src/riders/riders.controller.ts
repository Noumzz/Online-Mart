import { Body, Controller, Post } from '@nestjs/common';
import { RidersService } from './riders.service';
import { CreateRiderDto } from './dto/create-rider.dto';

@Controller('riders')
export class RidersController {
  constructor(private riderservice: RidersService) {}
  @Post('signup')
  createRider(@Body() createRiderDto: CreateRiderDto) {
    return this.riderservice.createRider(createRiderDto);
  }
}
