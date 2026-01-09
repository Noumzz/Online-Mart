import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  isString,
  IsString,
} from 'class-validator';

export class CreateMartOwnerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  contactNumber: string;

  @IsArray()
  @IsNotEmpty()
  @IsString()
  shops: string[];

  @IsArray()
  @IsNotEmpty()
  @IsString()
  products: string[];
}
