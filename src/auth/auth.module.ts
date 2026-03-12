import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { refreshJwtConfig } from './config/refresh-jwt.config';
import { jwtConfig } from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UserAuthController } from './user-auth/user-auth.controller';
import { UserAuthService } from './user-auth/user-auth.service';
import { JwtStrategy } from './user-auth/jwt-strategy';
import { RefreshJwtStrategy } from './user-auth/refresh-jwt.strategy';
import { riderJwt } from './config/rider-jwt.config';
import { riderRefreshJwt } from './config/rider-refresh-jwt.config';
import { RiderAuthService } from './rider-auth/rider-auth.service';
import { RidersModule } from 'src/riders/riders.module';
import { RidersJwtStrategy } from './rider-auth/rider-jwt.strategy';
import { RiderRefreshStrategy } from './rider-auth/rider-refresh-jwt.strategy';
import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { ownerJwtConfig } from './config/owner-jwt.config';
import { ownerRefreshJwtConfig } from './config/owner-refresh.config';
import { OwnerAuthService } from './owner-auth/owner-auth.service';
import { OwnerAuthController } from './owner-auth/owner-auth.controller';
import { OwnerJwtStrategy } from './owner-auth/owner-jwt.strategy';
import { OwnerRefreshStrategy } from './owner-auth/owner-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StoreOwner]),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(riderJwt),
    ConfigModule.forFeature(riderRefreshJwt),
    ConfigModule.forFeature(ownerJwtConfig),
    ConfigModule.forFeature(ownerRefreshJwtConfig),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
    forwardRef(() => RidersModule),
  ],
  controllers: [UserAuthController, OwnerAuthController],
  providers: [
    AuthService,
    UserAuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    RiderAuthService,
    RidersJwtStrategy,
    RiderRefreshStrategy,
    OwnerAuthService,
    OwnerJwtStrategy,
    OwnerRefreshStrategy,
  ],
  exports: [AuthService, UserAuthService, RiderAuthService, OwnerAuthService],
})
export class AuthModule {}
