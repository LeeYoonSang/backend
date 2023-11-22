import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../board.service';
import { BoardController } from '../board.controller';

const MockBoardRepository = () => ({
  getBoardList: jest.fn().mockReturnValue([{ id: 1, school_name: '서울고등학교', post_list: ['1', '2', '3', '4', '5'], area: '서울' }]),
  create: jest.fn().mockReturnValue({ school_name: '서울고등학교', area: '서울', id: 2 }),
  delete: jest.fn().mockReturnValue({ result: 'success', ststus: 200 }),
  getPostList: jest.fn().mockReturnValue([]),
  findOneBoard: jest.fn().mockReturnValue({
    id: 2,
    school_name: '서울고등학교',
    post_list: null,
    area: '서울',
  }),
});

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: BoardService,
          useValue: MockBoardRepository(),
        },
      ],
      controllers: [BoardController],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  describe('getBoardList', () => {
    it('게시판 리스트를 조회한다.', async () => {
      const result = await service.getBoardList();
      expect(result).toEqual([{ id: 1, school_name: '서울고등학교', post_list: ['1', '2', '3', '4', '5'], area: '서울' }]);
    });
  });

  describe('create', () => {
    it('계시판을 생성한다.', async () => {
      const account_id = '177ea3ab-8b0c-4363-b524-720dffa3895b';
      const result = await service.create(account_id);
      expect(result).toEqual({ school_name: '서울고등학교', area: '서울', id: 2 });
    });
  });

  describe('delete', () => {
    it('게시판을 삭제한다.', async () => {
      const board_id = '1';
      const account_id = '177ea3ab-8b0c-4363-b524-720dffa3895b';
      const result = await service.delete(board_id, account_id);
      expect(result.ststus).toEqual(200);
    });
  });

  describe('getPostList', () => {
    it('게시판내 게시글을 조회한다.', async () => {
      const request_body = {
        id: '2',
      };
      const result = await service.getPostList(request_body);
      expect(result).toEqual([]);
    });
  });

  describe('findOneBoard', () => {
    it('특정 게시판에 대한 정보를 조회한다.', async () => {
      const request_body = {
        id: '2',
        school_name: '서울고등학교',
        area: '서울',
      };
      const result = await service.findOneBoard(request_body);
      expect(result).toEqual({
        id: 2,
        school_name: '서울고등학교',
        post_list: null,
        area: '서울',
      });
    });
  });
});
