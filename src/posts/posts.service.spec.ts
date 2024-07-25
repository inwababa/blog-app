import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { HttpStatus } from '@nestjs/common';
import { PaginationRequest } from 'src/interfaces/pagination.interface';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = { title: 'Test Title', content: 'Test Content' };
    const user = { id: 1 } as User;
    const post = { id: 1, ...createPostDto, authorId: user.id };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(postRepository, 'create').mockReturnValue(post as any);
    jest.spyOn(postRepository, 'save').mockResolvedValue(post as any);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => result),
    } as any;

    await service.createPost(createPostDto, { user } as any, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Post Created',
      data: post,
    });
  });

  it('should get all posts', async () => {
    const posts = [
      { id: 1, title: 'Test Title 1', content: 'Test Content 1', authorId: 1 },
      { id: 2, title: 'Test Title 2', content: 'Test Content 2', authorId: 2 },
    ] as Post[];

    jest.spyOn(postRepository, 'find').mockResolvedValue(posts);

    const req = { pagination: { page: 1, limit: 10, skip: 0 } } as PaginationRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await service.getAllPost(req, res);

    expect(postRepository.find).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'All Posts',
      data: posts,
      page: 1,
      limit: 10,
    });
  });

  it('should get a single post', async () => {
    const post = { id: 1, title: 'Test Title', content: 'Test Content', authorId: 1 } as Post;

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await service.getSinglePost(1, res);

    expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Post Details',
      data: post,
    });
  });

  it('should update a post', async () => {
    const post = { id: 1, title: 'Old Title', content: 'Old Content', authorId: 1 } as Post;
    const updatePostDto: UpdatePostDto = { title: 'New Title', content: 'New Content' };

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);
    jest.spyOn(postRepository, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(postRepository, 'findOne').mockResolvedValue({ ...post, ...updatePostDto });

    const req = { user: { id: 1 } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await service.updatePost(1, updatePostDto, req, res);

    expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(postRepository.update).toHaveBeenCalledWith(1, updatePostDto);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Post Updated',
      data: { ...post, ...updatePostDto },
    });
  });

  it('should delete a post', async () => {
    const post = { id: 1, title: 'Test Title', content: 'Test Content', authorId: 1 } as Post;

    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);
    jest.spyOn(postRepository, 'remove').mockResolvedValue(post);

    const req = { user: { id: 1 } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await service.deletePost(1, req, res);

    expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(postRepository.remove).toHaveBeenCalledWith(post);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Post deleted successfully',
    });
  });
});
