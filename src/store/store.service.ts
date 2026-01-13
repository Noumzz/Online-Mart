import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto) {
    const store = new Store();
    store.name = createStoreDto.name;
    const storeOwner = await this.storeOwnerRepo.findByIds(
      createStoreDto.owners,
    );
    store.owners = storeOwner;
    store.contactNumber = createStoreDto.contactNumber;
    const products = await this.productRepo.findBy({ id: store.id });
    store.products = products;
    store.storeAddress = createStoreDto.storeAddress;
    return await this.storeRepo.save(store);
  }
}
