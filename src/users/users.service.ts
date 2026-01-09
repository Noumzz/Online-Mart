import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    //encrypt password
    const saltRount = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRount);

    user.password = hashedPassword;
    user.phone = createUserDto.phoneNumber;
    user.address = createUserDto.address;
    return await this.userRepo.save(user);
  }
}
