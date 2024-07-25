import { HttpStatus, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { PaginationRequest } from 'src/interfaces/pagination.interface';
import { Response } from 'express';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAllPost(@Req() req: PaginationRequest, @Res() res: Response): Promise<any> {
    try {
            const { page, limit, skip } = req.pagination;
            const posts = await this.postRepository.find({
            skip: skip,
            take: limit,
                });
                
                if(posts.length == 0) {
                    const response = {
                      success: true,
                      message: 'No Available Post',
                      data: null,
                    };
                    res.status(HttpStatus.ACCEPTED).json(response);
                    return; 
                  }

                const response = {
                    success: true,
                    message: 'All Posts',
                    data: posts,
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


  async getSinglePost(id: number, @Res() res: Response): Promise<Post> {
    try {
            const post = await this.postRepository.findOne({
                where: { id },
            });
            if (!post) {
                const response = {
                    success: true,
                    message: `Post with ID ${id} not found`,
                    data: null,
                };
                res.status(HttpStatus.ACCEPTED).json(response);
                return; 
            }
            const response = {
                success: true,
                message: `Post Details`,
                data: post,
            };
            res.status(HttpStatus.ACCEPTED).json(response);
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


  async createPost(createPostDto: CreatePostDto, @Req() req: PaginationRequest, @Res() res: Response): Promise<Post> {
    try {
        const user = req.user as User;
        const userId = user.id
        const userInDb = await this.usersRepository.findOne({ 
            where: { id: userId } 
        });
        if (!userInDb) {
            const response = {
                success: false,
                message: 'User not Found',
              };
             res.status(HttpStatus.NOT_FOUND).json(response);
             return;    
        }
        const post = this.postRepository.create({
        ...createPostDto,
        authorId: userId,
        });
        const newPost = await this.postRepository.save(post);

        
        const response = {
            success: true,
            message: `Post Created`,
            data: newPost,
          };
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

  async updatePost(id: number, updatePostDto: UpdatePostDto, @Req() req: PaginationRequest, @Res() res: Response): Promise<Post> {
    try {
        const user = req.user as User;
        const post = await this.postRepository.findOne({where: { id: id }});

        if (!post) {
            const response = {
                success: true,
                message: `Post with ID ${id} not found`,
                data: null,
            };
            res.status(HttpStatus.ACCEPTED).json(response);
            return; 
        }
        if (post.authorId !== user.id) {
            const response = {
                success: true,
                message: `You are not the author of this post`,
            };
            res.status(HttpStatus.UNAUTHORIZED).json(response);
            return; 
        }

        await this.postRepository.update(id, updatePostDto);
        const updatedPost = await this.postRepository.findOne({
            where: { id },
          });
        const response = {
            success: true,
            message: `Post Updated`,
            data: updatedPost,
          };
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

  async deletePost(id: number, @Req() req: PaginationRequest, @Res() res: Response): Promise<void> {
    try {
        const user = req.user as User;
        const post = await this.postRepository.findOne({where: { id: id }});

        if (!post) {
            const response = {
                success: true,
                message: `Post with ID ${id} not found`,
                data: null,
            };
            res.status(HttpStatus.ACCEPTED).json(response);
            return; 
        }

        if (post.authorId !== user.id) {
            const response = {
                success: true,
                message: `You are not the author of this post`,
            };
            res.status(HttpStatus.UNAUTHORIZED).json(response);
            return; 
          }
          await this.postRepository.remove(post);
          const response = {
            success: true,
            message: 'Post deleted successfully',
          };
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

  async searchPosts(searchPostDto: SearchPostDto, @Req() req: PaginationRequest, @Res() res: Response) {
    try {
        const {page, limit, skip} = req.pagination;
        const { title, content } = searchPostDto;

            const whereConditions = [];
            if (title) {
            whereConditions.push({ title: Like(`%${title}%`) });
            }
            if (content) {
            whereConditions.push({ content: Like(`%${content}%`) });
            }

            const posts = await this.postRepository.find({
            where: whereConditions,
            skip: skip,
            take: limit,
            });

            if(posts.length == 0) {
                const response = {
                  success: true,
                  message: 'No Available Search Post',
                  data: null,
                };
                res.status(HttpStatus.ACCEPTED).json(response);
                return; 
              }
              
              const response = {
                success: true,
                message: 'All Searches',
                data: posts,
                page: page,
                limit: limit
            }

            res.status(HttpStatus.OK).json({ response });
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