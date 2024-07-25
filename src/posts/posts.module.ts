import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationMiddleware } from 'src/middleware/pagination';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  providers: [PostsService, CommentsService],
  controllers: [PostsController],
})
export class PostsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(PaginationMiddleware).forRoutes(PostsController);
    }
}