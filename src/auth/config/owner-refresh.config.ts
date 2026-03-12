import { StringValue } from 'ms';
import { registerAs } from '@nestjs/config';

export const ownerRefreshJwtConfig = registerAs('ownerRefreshJwt', () => ({
  secret: process.env.OWNER_REFRESH_SECRET,
  expiresIn: process.env.OWNER_REFRESH_EXPIRY as StringValue,
}));
