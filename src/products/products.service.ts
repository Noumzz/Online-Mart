import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Store } from 'src/store/store.entity';
import { NotFoundException } from '@nestjs/common';
import { StoreOwner } from 'src/store-owner/store-owner.entity';

export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
    @InjectRepository(StoreOwner)
    private storeOwnerRepo: Repository<StoreOwner>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const product = new Product();
    product.productName = createProductDto.name;
    product.category = createProductDto.category;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.discount = createProductDto.discount;
    return await this.productRepo.save(product);
  }

  async getAll(userId: number) {
    const storeOwner = await this.storeOwnerRepo.findOneBy({ id: userId });
    if (!storeOwner) {
      throw new NotFoundException('No Store owner found');
    }
    const store = await this.storeRepo.findOneBy({ id: storeOwner.id });
    if (!store) {
      throw new NotFoundException('No store found');
    }
    return await this.productRepo.findBy({ store: store });
  }
}
