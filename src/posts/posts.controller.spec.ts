import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationRequest } from 'src/interfaces/pagination.interface';
import { CommentsService } from 'src/comments/comments.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    getAllPost: jest.fn(),
    getSinglePost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    searchPosts: jest.fn(),
  };

  const mockCommentsService = {
    getCommentsForPost: jest.fn(),
    createComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: CommentsService, useValue: mockCommentsService },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all posts', async () => {
    const req = { pagination: { page: 1, limit: 10, skip: 0 } } as PaginationRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.getAllPost(req, res);
    expect(service.getAllPost).toHaveBeenCalledWith(req, res);
  });

  it('should get a single post', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.getSinglePost(1, res);
    expect(service.getSinglePost).toHaveBeenCalledWith(1, res);
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = { title: 'Test Title', content: 'Test Content' };
    const req = { user: { id: 1 } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.createPost(createPostDto, req, res);
    expect(service.createPost).toHaveBeenCalledWith(createPostDto, req, res);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = { title: 'New Title', content: 'New Content' };
    const req = { user: { id: 1 } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.updatePost(1, updatePostDto, req, res);
    expect(service.updatePost).toHaveBeenCalledWith(1, updatePostDto, req, res);
  });

  it('should delete a post', async () => {
    const req = { user: { id: 1 } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.deletePost(1, req, res);
    expect(service.deletePost).toHaveBeenCalledWith(1, req, res);
  });

  it('should search posts', async () => {
    const searchPostDto: SearchPostDto = { title: 'Test', content: 'Content' };
    const req = { pagination: { page: 1, limit: 10, skip: 0 } } as PaginationRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    await controller.searchPosts(searchPostDto, req, res);
    expect(service.searchPosts).toHaveBeenCalledWith(searchPostDto, req, res);
  });
});
