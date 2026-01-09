import { Module } from '@nestjs/common';
import { MartOwnerService } from './store-owner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreOwner } from './store-owner.entity';
import { MartOwnerController } from './store-owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreOwner])],
  controllers: [MartOwnerController],
  providers: [MartOwnerService],
  exports: [MartOwnerService],
})
export class MartOwnerModule {}
