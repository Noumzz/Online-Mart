import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
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
}
