import { CreateRiderDto } from './dto/create-rider.dto';
import { Injectable } from '@nestjs/common';
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
}
