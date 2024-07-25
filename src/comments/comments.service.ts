import { HttpStatus, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { PaginationRequest } from 'src/interfaces/pagination.interface';
import { Response } from 'express';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getCommentsForPost(postId: number, @Req() req: PaginationRequest, @Res() res: Response) {
    try {
        const { page, limit, skip } = req.pagination;

       const comments = await this.commentRepository.find({
            where: { postId },
            skip: skip,
            take: limit,
          });

          if(comments.length == 0) {
            const response = {
              success: true,
              message: 'No Available Comment on this Post',
              data: null,
            };
            res.status(HttpStatus.ACCEPTED).json(response);
            return; 
          }

          const response = {
            success: true,
            message: 'Comments retrieved successfully',
            data: comments,
            page: page,
            limit: limit
          }

          res.status(HttpStatus.OK).json(response);
          return;
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
          };
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
          return;
    }
    
  }


  async createComment(postId: number, createCommentDto: CreateCommentDto, @Req() req: PaginationRequest, @Res() res: Response) {
    try {
        const user = req.user as User;
        const userId = user.id
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });
        if (!post) {
            const response = {
                success: true,
                message: `Post with ID ${postId} not found`,
                data: null,
            };
            res.status(HttpStatus.ACCEPTED).json(response);
            return; 
        }
        const comment = this.commentRepository.create({
            ...createCommentDto,
            postId,
            authorId: userId,
          });
      
          const savedComment = await this.commentRepository.save(comment);

          const response = {
            success: true,
            message: 'Comment created successfully',
            data: comment,
          }
          res.status(HttpStatus.CREATED).json(response);
          return;
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
          };
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
          return;
    }
  }


  async updateComment(id: number, updateCommentDto: UpdateCommentDto, @Req() req: PaginationRequest, @Res() res: Response) {
    try {
        const user = req.user as User;
        const comment = await this.commentRepository.findOne({ where: { id } });

        if (!comment) {
            const response = {
                success: true,
                message: `Comment not found`,
                data: null,
            };
            res.status(HttpStatus.NOT_FOUND).json(response);
            return; 
        }

        if (comment.authorId !== user.id) {
            const response = {
                success: true,
                message: `You are not authorized to update this comment`,
            };
            res.status(HttpStatus.UNAUTHORIZED).json(response);
            return; 
        }

        await this.commentRepository.update(id, updateCommentDto);

        const updatedComment = await this.commentRepository.findOne({ where: { id } });

        const response = {
            success: true,
            message: 'Comment Updated successfully',
            data: updatedComment,
          }
          res.status(HttpStatus.CREATED).json(response);
          return;
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
          };
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
          return;
    }
    
  }

  async deleteComment(id: number, @Req() req: PaginationRequest, @Res() res: Response) {
    try {
        const user = req.user as User;
        const comment = await this.commentRepository.findOne({ where: { id } });

            if (!comment) {
                const response = {
                    success: true,
                    message: `Comment not found`,
                    data: null,
                };
                res.status(HttpStatus.NOT_FOUND).json(response);
                return; 
            }

            if (comment.authorId !== user.id) {
                const response = {
                    success: true,
                    message: `You are not authorized to delete this comment`,
                };
                res.status(HttpStatus.UNAUTHORIZED).json(response);
                return;
            }

            await this.commentRepository.delete(id);

            const response = {
                success: true,
                message: 'Comment deleted successfully',
              }
            res.status(HttpStatus.OK).json(response);

            return;
    } catch (error) {
        const response = {
            success: false,
            message: error.message,
          };
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
          return;
    }
    
  }

}