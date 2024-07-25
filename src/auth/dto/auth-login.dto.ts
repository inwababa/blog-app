import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class AuthLoginDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString() 
    email: string;
    
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  
}