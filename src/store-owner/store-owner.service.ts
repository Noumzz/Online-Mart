import { CreateMartOwnerDto } from './dto/mart-owner.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreOwner } from './store-owner.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MartOwnerService {
  constructor(
    @InjectRepository(StoreOwner) private martOwnerRepo: Repository<StoreOwner>,
  ) {}
  async createProfile(createMartOwnerDto: CreateMartOwnerDto) {
    const martOwner = new StoreOwner();
    martOwner.firstName = createMartOwnerDto.firstName;
    martOwner.lastName = createMartOwnerDto.lastName;
    martOwner.email = createMartOwnerDto.email;
    const genSalt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(
      createMartOwnerDto.password,
      genSalt,
    );
    martOwner.password = hashedPassword;
    martOwner.contactNumber = createMartOwnerDto.contactNumber;
    return await this.martOwnerRepo.save(martOwner);
  }
}
