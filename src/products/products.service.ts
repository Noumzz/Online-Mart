import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Store } from 'src/store/store.entity';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async createProduct(
    ownerId: number,
    storeId: number,
    createProductDto: CreateProductDto,
  ) {
    const store = await this.storeRepo.findOne({
      where: {
        id: storeId,
        owners: { id: ownerId },
      },
      relations: ['products'],
    });

    if (!store) {
      throw new UnauthorizedException();
    }

    const existingProduct = await this.productRepo.findOne({
      where: {
        productName: createProductDto.name,
        store: { id: storeId },
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product already exists in this store');
    }

    const product = new Product();
    product.productName = createProductDto.name;
    product.category = createProductDto.category;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.discount = createProductDto.discount;
    product.store = store;
    return await this.productRepo.save(product);
  }

  async getAll(id: number) {
    const storeOwner = await this.storeOwnerRepo.findOneBy({ id: id });
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
