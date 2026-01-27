import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRiderDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
