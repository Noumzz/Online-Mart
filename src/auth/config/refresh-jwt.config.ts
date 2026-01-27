import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export const refreshJwtConfig = registerAs('refreshJwt', () => ({
  secret: process.env.REFRESH_SECRET,
  expiresIn: process.env.REFRESH_EXPIRY as StringValue,
}));
