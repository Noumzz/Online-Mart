import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Controller('user-auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    await this.userAuthService.compareRefreshToken(req.user.userId, token);
    return await this.userAuthService.refreshTokens(req.user.userId);
  }
}
