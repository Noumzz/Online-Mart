import { jwtConfig } from './../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import type { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { refreshJwtConfig } from '../config/refresh-jwt.config';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private jwtService: JwtService,
    private userAuthService: UserAuthService,
    @Inject(refreshJwtConfig.KEY)
    private jwtRefreshConfig: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRefreshConfig.secret as string,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return this.userAuthService.validateUser(userId);
  }
}
