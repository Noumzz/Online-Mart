import { OwnerAuthService } from './owner-auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginOwnerDto } from 'src/store-owner/dto/login-owner.dto';

@Controller('owner-auth')
export class OwnerAuthController {
  constructor(private ownerAuthController: OwnerAuthService) {}

  @Post('login')
  login(@Body() dto: LoginOwnerDto) {
    return this.ownerAuthController.login(dto);
  }
}
