import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Post } from 'src/posts/entities/post.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Post]),
        ],
    providers: [UsersService, JwtService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}