import { riderJwt } from './../config/rider-jwt.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RiderJwtPayload } from '../types/rider-jwtPayload';
import { RidersService } from 'src/riders/riders.service';
import { RiderAuthService } from './rider-auth.service';
import { Request } from 'express';

@Injectable()
export class RidersJwtStrategy extends PassportStrategy(
  Strategy,
  'riderJwtStrategy',
) {
  constructor(
    @Inject(riderJwt.KEY)
    private jwtRider: ConfigType<typeof riderJwt>,
    private riderAuthService: RiderAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRider.secret as string,
    });
  }

  validate(req: Request, payload: RiderJwtPayload) {
    const riderId = payload.sub;
    return this.riderAuthService.validateRider(riderId);
  }
}
