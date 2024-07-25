import { Controller, Get, Post, Put, Delete, Param, Body, Req, Res, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationRequest } from 'src/interfaces/pagination.interface';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment( @Param('id') id: number, @Req() req: PaginationRequest, @Body() updateCommentDto: UpdateCommentDto,
    @Res() res: Response): Promise<void> {
    return await this.commentsService.updateComment(id, updateCommentDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment( @Param('id') id: number, @Req() req: PaginationRequest, @Res() res: Response): Promise<void> {
      
      return await this.commentsService.deleteComment(id, req, res);
}

}