import { UserAuthService } from 'src/auth/user-auth/user-auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/user-auth/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(
    private userService: UsersService,
    private userAuthService: UserAuthService,
  ) {}
  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userAuthService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.userAuthService.logout(req.user.userId);
  }
}
