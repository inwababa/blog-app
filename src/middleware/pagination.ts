import { Injectable, NestMiddleware } from '@nestjs/common';
import { PaginationRequest } from '../interfaces/pagination.interface';
import { Response, NextFunction } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: PaginationRequest, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };
    next();
  }
}