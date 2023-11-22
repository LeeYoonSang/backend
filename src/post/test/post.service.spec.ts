import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../post.service';
import { PostController } from '../post.controller';

const MockPostRepository = () => ({
  createPost: jest.fn().mockReturnValue({
    id: 6,
    title: '서울고4',
    detail: '고3 내용입니다.',
    author: '홍길동3',
    school_name: '서울고등학교',
    area: '서울',
    create_date: '2023-11-22T12:31:46.000Z',
    update_date: '2023-11-22T12:31:46.000Z',
    author_id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
  }),
  getPostDetail: jest.fn().mockReturnValue([
    {
      id: 6,
      title: '서울고4',
      detail: '고3 내용입니다.',
      author: '홍길동3',
      school_name: '서울고등학교',
      area: '서울',
      create_date: '2023-11-22T12:31:46.000Z',
      update_date: '2023-11-22T12:31:46.000Z',
      author_id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
    },
  ]),
});

describe('BoardService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostService,
          useValue: MockPostRepository(),
        },
      ],
      controllers: [PostController],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  describe('createPost', () => {
    it('게시글을 등록한다.', async () => {
      const request_body = {
        author_id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
        title: '서울고4',
        detail: '고3 내용입니다.',
      };
      const result = await service.createPost(request_body);
      expect(result).toEqual({
        id: 6,
        title: '서울고4',
        detail: '고3 내용입니다.',
        author: '홍길동3',
        school_name: '서울고등학교',
        area: '서울',
        create_date: '2023-11-22T12:31:46.000Z',
        update_date: '2023-11-22T12:31:46.000Z',
        author_id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
      });
    });
  });

  describe('getPostDetail', () => {
    it('특정 게시글을 조회한다.', async () => {
      const request_body = {
        id: ['6'],
      };
      const result = await service.getPostDetail(request_body);
      expect(result).toEqual([
        {
          id: 6,
          title: '서울고4',
          detail: '고3 내용입니다.',
          create_date: '2023-11-22T12:31:46.000Z',
          update_date: '2023-11-22T12:31:46.000Z',
          author: '홍길동3',
          author_id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
          school_name: '서울고등학교',
          area: '서울',
        },
      ]);
    });
  });
});
