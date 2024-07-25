import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
  
}