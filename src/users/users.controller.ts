import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}


  @Post('signup')
  async signUp( @Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return await this.usersService.create(createUserDto, res);
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response){
    return await this.usersService.loginUser(loginDto, res);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    return await this.usersService.getProfile(req, res)
    }
}