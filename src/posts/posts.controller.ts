import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { PaginationRequest } from 'src/interfaces/pagination.interface';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { SearchPostDto } from './dto/search-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService,
            private readonly commentsService: CommentsService
  ) {}


  @Get()
  async getAllPost(@Req() req: PaginationRequest, @Res() res: Response) {
    return this.postsService.getAllPost(req, res);
  }


  @Get(':id')
  async getSinglePost(@Param('id') id: number, @Res() res: Response) {
    return await this.postsService.getSinglePost(id, res);
  }


  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: PaginationRequest, @Res() res: Response) {
    
    return await this.postsService.createPost(createPostDto, req, res);
    
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Req() req: PaginationRequest, @Res() res: Response) {
    
    return await this.postsService.updatePost(id, updatePostDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: number, @Req() req: PaginationRequest, @Res() res: Response) {

    return await this.postsService.deletePost(id, req, res);
  }


  @Get(':postId/comments')
  async getComments( @Param('postId') postId: number, @Req() req: PaginationRequest, @Res() res: Response): Promise<void> {
    
      return await this.commentsService.getCommentsForPost(postId, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createComment( @Param('postId') postId: number, @Req() req: PaginationRequest, @Body() createCommentDto: CreateCommentDto, @Res() res: Response): Promise<void> {
      return await this.commentsService.createComment(postId, createCommentDto, req, res);
  }


  @Get('all/search')
  async searchPosts(@Query() searchPostDto: SearchPostDto, @Req() req: PaginationRequest, @Res() res: Response ) {
        //const searchPostDto = { title, content };
        return await this.postsService.searchPosts(searchPostDto, req, res); 
  }

}