import { Body, Controller, Get, Post } from '@nestjs/common';
import { MartOwnerService } from './store-owner.service';
import { OwnerSignupDto } from './dto/mart-owner.dto';

@Controller('mart-owner')
export class MartOwnerController {
  constructor(private martOwnerService: MartOwnerService) {}

  @Post('signup')
  createProfile(@Body() createMartOwnerDto: OwnerSignupDto) {
    return this.martOwnerService.createProfile(createMartOwnerDto);
  }

  @Get('hello')
  hello() {
    return 'Hello';
  }
}
