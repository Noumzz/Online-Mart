import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ownerJwtConfig } from '../config/owner-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { OwnerJwtPayload } from '../types/owner-jwtPayload';
import { Request } from 'express';
import { OwnerAuthService } from './owner-auth.service';

@Injectable()
export class OwnerJwtStrategy extends PassportStrategy(
  Strategy,
  'ownerJwtStrategy',
) {
  constructor(
    @Inject(ownerJwtConfig.KEY)
    ownerConfigJwt: ConfigType<typeof ownerJwtConfig>,
    private ownerAuthService: OwnerAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ownerConfigJwt.secret as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: OwnerJwtPayload) {
    const ownerId = payload.sub;
    return await this.ownerAuthService.validateOwner(ownerId);
  }
}
