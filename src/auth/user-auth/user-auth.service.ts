import { CurrentUser } from './../types/user.d';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { refreshJwtConfig } from '../config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserAuthService {
  constructor(
    private userService: UsersService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private jwtRefreshConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtConfig.KEY)
    private configJwt: ConfigType<typeof jwtConfig>,
  ) {}
  async login(dto: LoginUserDto) {
    const email = dto.email;
    const user = await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User with this email doesnot exist');
    }
    const password = dto.password;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Entered password is incorrect');
    }

    const { accessToken, refreshToken } = await this.generateToken(user.id);
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configJwt.secret,
        expiresIn: this.configJwt.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshConfig.secret,
        expiresIn: this.jwtRefreshConfig.expiresIn,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: number) {
    const user = this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const CurrentUser: CurrentUser = { userId: userId };
    return CurrentUser;
  }

  async logout(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.hashedRefreshToken = null;
    await this.userRepo.save(user);
    return 'Logout Sucessfull';
  }

  async refreshTokens(userId: number) {
    const user = await this.userService.findOne(userId);
    const { accessToken, refreshToken } = await this.generateToken(userId);
    await this.userService.updateRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async compareRefreshToken(userId: number, hashToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userRefreshToken = user.hashedRefreshToken;
    if (!userRefreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }
    const refreshTokenMatch = await bcrypt.compare(hashToken, userRefreshToken);
    if (!refreshTokenMatch) {
      throw new UnauthorizedException('Refresh token didnot match');
    }
    return { id: user.id };
  }
}
