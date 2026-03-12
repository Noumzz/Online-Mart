import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ownerRefreshJwtConfig } from '../config/owner-refresh.config';
import type { ConfigType } from '@nestjs/config';
import { OwnerJwtPayload } from '../types/owner-jwtPayload';
import { Request } from 'express';
import { OwnerAuthService } from './owner-auth.service';

@Injectable()
export class OwnerRefreshStrategy extends PassportStrategy(
  Strategy,
  'ownerRefreshStrategy',
) {
  constructor(
    private ownerAuthService: OwnerAuthService,
    @Inject(ownerRefreshJwtConfig.KEY)
    ownerRefreshConfig: ConfigType<typeof ownerRefreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ownerRefreshConfig.secret as string,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: OwnerJwtPayload) {
    const ownerId = payload.sub;
    const token = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!token) {
      throw new NotFoundException();
    }
    return this.ownerAuthService.compareTokens(ownerId, token);
  }
}
