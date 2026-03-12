import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class OwnerSignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  contactNumber: string;
}
