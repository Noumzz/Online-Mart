import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { riderRefreshJwt } from '../config/rider-refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { RiderJwtPayload } from '../types/rider-jwtPayload';
import { Request } from 'express';
import { RiderAuthService } from './rider-auth.service';

@Injectable()
export class RiderRefreshStrategy extends PassportStrategy(
  Strategy,
  'riderRefreshJwt',
) {
  constructor(
    @Inject(riderRefreshJwt.KEY)
    private refreshRiderJwt: ConfigType<typeof riderRefreshJwt>,
    private riderAuthService: RiderAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshRiderJwt.secret as string,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: RiderJwtPayload) {
    const id = payload.sub;
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    //console.log(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('');
    }
    return this.riderAuthService.compareRefreshToken(id, refreshToken);
  }
}
