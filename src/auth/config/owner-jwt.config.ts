import { StringValue } from 'ms';
import { registerAs } from '@nestjs/config';

export const ownerJwtConfig = registerAs('ownerJwt', () => ({
  secret: process.env.OWNER_JWT_SECRET,
  expiresIn: process.env.OWNER_JWT_EXPIRY as StringValue,
}));
