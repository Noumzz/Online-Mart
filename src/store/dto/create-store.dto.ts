import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  @IsString()
  storeAddress: string;

  @IsNumber()
  @IsArray()
  owners: number[];

  @IsNumber()
  @IsArray()
  products: number[];
}
