import { JwtService } from '@nestjs/jwt';
import { OwnerJwtPayload } from '../types/owner-jwtPayload';
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ownerJwtConfig } from '../config/owner-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { ownerRefreshJwtConfig } from '../config/owner-refresh.config';
import { LoginOwnerDto } from 'src/store-owner/dto/login-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class OwnerAuthService {
  constructor(
    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,
    private jwtService: JwtService,
    @Inject(ownerJwtConfig.KEY)
    private ownerConfigJwt: ConfigType<typeof ownerJwtConfig>,
    @Inject(ownerRefreshJwtConfig.KEY)
    private onwerConfigRefreshJwt: ConfigType<typeof ownerRefreshJwtConfig>,
  ) {}

  async login(dto: LoginOwnerDto) {
    const email = dto.email;
    const owner = await this.storeOwnerRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!owner) {
      throw new NotFoundException("email or password doesn't match");
    }
    const password = dto.password;
    const isMatch = await bcrypt.compare(password, owner.password);
    //console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException("email or password doesn't match");
    }
    const { accessToken, refreshToken } = await this.generateTokens(owner.id);
    await this.updateRefreshToken(owner.id, refreshToken);
    console.log(owner);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async generateTokens(riderId: number) {
    const payload: OwnerJwtPayload = { sub: riderId };
    const [ownerAccessToken, ownerRefreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.ownerConfigJwt.secret,
        expiresIn: this.ownerConfigJwt.expiresIn,
      }),

      await this.jwtService.signAsync(payload, {
        secret: this.onwerConfigRefreshJwt.secret,
        expiresIn: this.onwerConfigRefreshJwt.expiresIn,
      }),
    ]);
    return {
      accessToken: ownerAccessToken,
      refreshToken: ownerRefreshToken,
    };
  }

  async validateOwner(id: number) {
    const owner = await this.storeOwnerRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!owner) {
      throw new NotFoundException('Not found');
    }
    return id;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const owner = await this.storeOwnerRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!owner) {
      throw new NotFoundException('Not found');
    }
    owner.refreshToken = refreshToken;
    await this.storeOwnerRepo.save(owner);
    return;
  }

  async refreshToken(id: number) {
    const owner = await this.storeOwnerRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!owner) {
      throw new NotFoundException();
    }
    const { accessToken, refreshToken } = await this.generateTokens(owner.id);
    await this.updateRefreshToken(owner.id, refreshToken);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async compareTokens(id: number, refreshToken: string) {
    const owner = await this.storeOwnerRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!owner || owner.refreshToken === null) {
      throw new NotFoundException();
    }
    const isMatch = bcrypt.compare(refreshToken, owner.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Imcorrect token');
    }
    return owner.id;
  }
}
