import { riderJwt } from './../config/rider-jwt.config';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RidersService } from 'src/riders/riders.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import type { ConfigType } from '@nestjs/config';
import { riderRefreshJwt } from '../config/rider-refresh-jwt.config';
import { CurrentRider } from '../types/rider';
import { RiderJwtPayload } from '../types/rider-jwtPayload';

@Injectable()
export class RiderAuthService {
  constructor(
    private riderService: RidersService,
    private jwtService: JwtService,
    @Inject(riderJwt.KEY) private jwtRider: ConfigType<typeof riderJwt>,
    @Inject(riderRefreshJwt.KEY)
    private refreshRiderJwt: ConfigType<typeof riderRefreshJwt>,
  ) {}

  async login(email: string, password: string) {
    const user = await this.riderService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const { riderAccessToken, riderRefreshToken } =
      await this.generateRiderTokens(user.id);
    await this.riderService.updateRefreshToken(user.id, riderRefreshToken);
    return {
      riderAccessToken,
      riderRefreshToken,
    };
  }
  async generateRiderTokens(riderId: number) {
    const payload: RiderJwtPayload = { sub: riderId };
    const [riderAccessToken, riderRefreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.jwtRider.secret,
        expiresIn: this.jwtRider.expiresIn,
      }),
      await this.jwtService.signAsync(payload, {
        secret: this.refreshRiderJwt.secret,
        expiresIn: this.refreshRiderJwt.expiresIn,
      }),
    ]);
    return { riderAccessToken, riderRefreshToken };
  }

  async refreshToken(riderId: number) {
    const rider = this.riderService.findOne(riderId);
    if (!rider) {
      throw new NotFoundException('rider not found');
    }
    const { riderAccessToken, riderRefreshToken } =
      await this.generateRiderTokens(riderId);
    await this.riderService.updateRefreshToken(riderId, riderRefreshToken);
    return {
      riderAccessToken,
      riderRefreshToken,
    };
  }

  async compareRefreshToken(id: number, refreshToken: string) {
    const rider = await this.riderService.findOne(id);
    if (!rider || rider.refreshToken === null) {
      throw new NotFoundException('rider not found');
    }
    const isMatch = await bcrypt.compare(refreshToken, rider.refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException('wrong token');
    }
    return rider.id;
  }

  async validateRider(id: number) {
    const rider = this.riderService.findOne(id);
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }
    const currentRider: CurrentRider = { riderId: id };

    return currentRider;
  }
}
