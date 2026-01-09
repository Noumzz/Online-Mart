import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @Post('create')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }
}
