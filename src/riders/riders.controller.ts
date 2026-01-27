import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { LoginRiderDto } from './dto/login-rider.dto';
import { RiderAuthService } from 'src/auth/rider-auth/rider-auth.service';
import { RiderJwtAuthGuard } from 'src/auth/rider-auth/rider-jwt.auth.guard';
import { RiderRefreshGuard } from 'src/auth/rider-auth/rider-refresh-jwt.guard';

@Controller('riders')
export class RidersController {
  constructor(
    private riderservice: RidersService,
    private riderAuthService: RiderAuthService,
  ) {}
  @Post('signup')
  createRider(@Body() createRiderDto: CreateRiderDto) {
    return this.riderservice.createRider(createRiderDto);
  }

  @Post('login')
  loginRider(@Body() loginRiderDto: LoginRiderDto) {
    return this.riderAuthService.login(
      loginRiderDto.email,
      loginRiderDto.password,
    );
  }
  @UseGuards(RiderRefreshGuard)
  @Post('refresh')
  refresh(@Req() req) {
    return this.riderAuthService.refreshToken(req.user);
  }
}
