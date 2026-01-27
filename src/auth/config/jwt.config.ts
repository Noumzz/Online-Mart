import { ConfigService, registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRY as StringValue,
}));
