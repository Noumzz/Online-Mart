import { StringValue } from 'ms';
import { registerAs } from '@nestjs/config';

export const riderJwt = registerAs('riderJwt', () => ({
  secret: process.env.RIDER_JWT_SECRET,
  expiresIn: process.env.RIDER_JWT_EXPIRY as StringValue,
}));
