import { jwtConfig } from './../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import type { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userAuthService: UserAuthService,
    @Inject(jwtConfig.KEY)
    private configJwt: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configJwt.secret as string,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    return this.userAuthService.validateUser(userId);
  }
}
