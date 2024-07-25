import { HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UserUtils } from 'src/utils/user.utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto, @Res() res: Response): Promise<any> {
        try {
            const { email, password } = createUserDto;
            const userInDb = await this.usersRepository.findOne({ 
                where: { email: email } 
            });
            if (userInDb) {
                const response = {
                    success: false,
                    message: 'Email already exists',
                  };
                 res.status(HttpStatus.CONFLICT).json(response);
                 return;    
            }

            const hashedPassword = await bcrypt.hash(password, 10);
        
                const user = this.usersRepository.create({
                    ...createUserDto,
                    password: hashedPassword
                });
                await this.usersRepository.save(user);
        
                delete user.password;
                const response = {
                    success: true,
                    message: 'Account created Successfully',
                    data: user
                  };
                 res.status(HttpStatus.CREATED).json(response);
                 return; 
                
        } catch (error) {
            
            const response = {
                success: false,
                message: error.message,
              };
             res.status(HttpStatus.BAD_REQUEST).json(response);
             return; 
        }
        
    }


    async loginUser(loginDto: LoginDto,  @Res() res: Response): Promise<any>  {
        try {
          const { email, password } = loginDto;

          const user = await this.usersRepository.findOne({ where: {
            email: email}, });


          if (!user) {
            const response = {
                success: false,
                message: 'Email not Found',
              };
             res.status(HttpStatus.NOT_FOUND).json(response);
             return;  
          }      
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
        
            if (!isPasswordValid) {
                const response = {
                    success: false,
                    message: 'Invalid credentials.',
                  };
                 res.status(HttpStatus.UNAUTHORIZED).json(response);
                 return;  
            } 
                const payload = this.jwtService.sign({
                    userId: user.id, username: user.username
                    });

                    const response = {
                        success: true,
                        access_token: payload,
                    }
                    res.status(HttpStatus.OK).json(response);
                    return;
            
        } catch (error) {
          return {
            success: false,
            message: error.message
          }
        }
        
      }

      async getProfile(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const user = req.user;
        const userWithoutPassword = UserUtils.removePassword(user);
        const response = {
          success: true,
          message: 'User Profile.',
          data: userWithoutPassword
        };
        res.status(HttpStatus.OK).json(response);
        return;
        } catch (error) {
            return {
                success: false,
                message: error.message
              }
        }
      }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: {
            email: email}, });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOneBy({ id: id });
    }

    
}