import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from './rider.entity';
import { RidersController } from './riders.controller';
import { RidersService } from './riders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rider])],
  controllers: [RidersController],
  providers: [RidersService],
  exports: [RidersService],
})
export class RidersModule {}
