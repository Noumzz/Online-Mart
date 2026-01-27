import { StringValue } from 'ms';
import { registerAs } from '@nestjs/config';

export const riderRefreshJwt = registerAs('riderRefreshJwt', () => ({
  secret: process.env.RIDER_REFRESH_SECRET,
  expiresIn: process.env.RIDER_REFRESH_EXPIRY as StringValue,
}));
