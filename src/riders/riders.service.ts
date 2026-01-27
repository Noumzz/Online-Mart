import { CreateRiderDto } from './dto/create-rider.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Rider)
    private riderRepo: Repository<Rider>,
  ) {}
  async createRider(createRiderDto: CreateRiderDto) {
    const rider = new Rider();
    rider.firstName = createRiderDto.firstName;
    rider.lastName = createRiderDto.lastName;
    rider.email = createRiderDto.email;
    const saltRound = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(
      createRiderDto.password,
      saltRound,
    );
    rider.password = hashedPassword;
    rider.contactNumber = createRiderDto.contactNumber;
    rider.bikeRegistrationNumber = createRiderDto.bikeRegistrationNumber;
    rider.bikeType = createRiderDto.bikeType;
    rider.linsence = createRiderDto.linsence;
    const savedRider = await this.riderRepo.save(rider);
    return savedRider;
  }

  async findOneByEmail(email: string) {
    const rider = this.riderRepo.findOne({
      where: {
        email: email,
      },
    });
    if (!rider) {
      throw new NotFoundException("Rider with this email doesn't exist");
    }
    return rider;
  }

  async findOne(id: number) {
    const rider = this.riderRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }
    return rider;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const rider = await this.findOne(id);
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    rider.refreshToken = hashedRefreshToken;
    await this.riderRepo.save(rider);
  }
}
