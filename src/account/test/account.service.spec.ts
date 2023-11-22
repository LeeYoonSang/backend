import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account.service';
import { AccountController } from '../account.controller';

const MockAccountRepository = () => ({
  findOneAccount: jest.fn().mockReturnValue({
    id: '177ea3ab-8b0c-4363-b524-720dffa3895b',
    email: 'aaa2@aaa.co.kr',
    name: '홍길동3',
    school_name: '서울고등학교',
    type: 'admin',
    subscribe_list: [{ id: '1', create_date: '2023-11-22 05:51:25', delete_date: null }],
  }),
  create: jest.fn().mockReturnValue({
    id: 'ae9f5bf0-66e7-4e53-ac5b-854ec8036434',
    name: '홍길동3',
    school_name: '서울고등학교',
    type: 'admin',
    email: 'aaa3@aaa.co.kr',
    area: '서울',
    subscribe_list: null,
  }),
  update: jest.fn().mockReturnValue({ status: 200 }),
  getMySubscribe: jest.fn().mockReturnValue([
    {
      id: 5,
      title: '서울고4',
      detail: '고3 내용입니다.',
      create_date: '2023-11-22T08:10:20.000Z',
      update_date: '2023-11-22T08:10:20.000Z',
      author: '홍길동3',
      author_id: '',
      school_name: '서울고등학교',
      area: '서울',
    },
  ]),
  getMySubscribeBoardList: jest.fn().mockReturnValue([{ id: 1, school_name: '서울고등학교', post_list: ['1', '2', '3', '4', '5'], area: '서울' }]),
  findOneList: jest.fn().mockReturnValue([
    {
      id: 5,
      title: '서울고4',
      detail: '고3 내용입니다.',
      create_date: '2023-11-22T08:10:20.000Z',
      update_date: '2023-11-22T08:10:20.000Z',
      author: '홍길동3',
      author_id: '',
      school_name: '서울고등학교',
      area: '서울',
    },
  ]),
});

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountService,
          useValue: MockAccountRepository(),
        },
      ],
      controllers: [AccountController],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('findOneAccount', () => {
    it('계정정보를 조회한다.', async () => {
      const result = await service.findOneAccount({ id: '177ea3ab-8b0c-4363-b524-720dffa3895b' });
      expect(result.id).toEqual('177ea3ab-8b0c-4363-b524-720dffa3895b');
    });
  });

  describe('create', () => {
    it('계정을 등록한다.', async () => {
      const result = await service.create({
        name: '홍길동3',
        email: 'aaa3@aaa.co.kr',
        school_name: '서울고등학교',
        area: '서울',
        type: 'admin',
      });
      expect(result.id).toEqual('ae9f5bf0-66e7-4e53-ac5b-854ec8036434');
    });
  });

  describe('update', () => {
    it('계정정보를 업데이트 한다', async () => {
      const result = await service.update({
        id: 'ae9f5bf0-66e7-4e53-ac5b-854ec8036434',
        name: '홍길동3',
        email: 'aaa3@aaa.co.kr',
        school_name: '서울고등학교',
        area: '서울',
        type: 'admin',
        subscribe_list: null,
      });
      expect(result.status).toEqual(200);
    });
  });

  describe('getMySubscribeBoardList', () => {
    it('구독중인 게시판 정보를 가져온다', async () => {
      const account_id = '177ea3ab-8b0c-4363-b524-720dffa3895b';
      const result = await service.getMySubscribeBoardList(account_id);
      expect(result).toEqual([{ id: 1, school_name: '서울고등학교', post_list: ['1', '2', '3', '4', '5'], area: '서울' }]);
    });
  });

  describe('getMySubscribe', () => {
    it('구독중인 게시판 전체 글 목록을 가져온다.', async () => {
      const account_id = '177ea3ab-8b0c-4363-b524-720dffa3895b';
      const result = await service.getMySubscribe(account_id);
      expect(result).toEqual([
        {
          id: 5,
          title: '서울고4',
          detail: '고3 내용입니다.',
          create_date: '2023-11-22T08:10:20.000Z',
          update_date: '2023-11-22T08:10:20.000Z',
          author: '홍길동3',
          author_id: '',
          school_name: '서울고등학교',
          area: '서울',
        },
      ]);
    });
  });

  describe('findOneList', () => {
    it('구독중인 게시판 중 특정 게시판에 있는 게시글을 조회한다.', async () => {
      const account_id = '177ea3ab-8b0c-4363-b524-720dffa3895b';
      const board_id = '1';

      const result = await service.findOneList(account_id, board_id);
      expect(result).toEqual([
        {
          id: 5,
          title: '서울고4',
          detail: '고3 내용입니다.',
          create_date: '2023-11-22T08:10:20.000Z',
          update_date: '2023-11-22T08:10:20.000Z',
          author: '홍길동3',
          author_id: '',
          school_name: '서울고등학교',
          area: '서울',
        },
      ]);
    });
  });
});
