import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardService } from 'src/board/board.service';
import { AccountDetailDto, CreateAccountDto, SubscribeListDto } from 'src/dto/account.Dto';
import { AccountEntity } from 'src/entities/UserData.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  /**
   * 회원을 생서한다.
   * @param body 회원 정보
   * @returns
   */
  async create(body: CreateAccountDto) {
    const { name, email, school_name, type, area } = body;
    const existedAccount = await this.findOneAccount({ name, email });

    if (existedAccount) {
      throw new BadRequestException('이미 존재하는 회원입니다.');
    }
    const id = v4();

    const account = await this.accountRepository.save({
      id,
      name,
      school_name,
      type,
      email,
      area,
    });

    return {
      id,
      ...account,
    };
  }

  /**
   * 계정 정보를 조회한다.
   * @param data 계정정보
   * @returns
   */
  async findOneAccount(data: object) {
    const account = await this.accountRepository.findOne({
      where: {
        ...data,
      },
    });

    return account;
  }

  /**
   * 계정 정보를 업데이트 한다.
   * @param data 계정정보
   * @returns
   */
  async update(data: AccountDetailDto) {
    await this.accountRepository.update(data.id, {
      ...data,
    });

    return {
      status: 200,
    };
  }
  /**
   * 구독 페이지 리스트 조회
   * @param id 사용자 ID
   * @returns
   */
  async getMySubscribeBoardList(id: string) {
    const account_data = await this.findOneAccount({ id });
    const subscribe_list = account_data.subscribe_list?.filter((data) => !data.delete_date);

    if (!!subscribe_list) {
      const result = await Promise.all(subscribe_list.map(async (data) => await this.boardService.findOneBoard({ id: data.id })));

      return result;
    }
    return {
      message: '구독중인 게시판이 없습니다.',
    };
  }

  /**
   * 구독중인 게시판 전체 글 목록 불러오기
   * @param id 사용자 ID
   * @returns
   */
  async getMySubscribe(id: string) {
    const account_data = await this.findOneAccount({ id });
    const subscribe_list = account_data.subscribe_list;

    if (!!subscribe_list) {
      const result = await this.sortList(subscribe_list);

      return result;
    }

    return [];
  }
  /**
   * 구독중인 게시판 중 특정 학교 게시판 리스트 조회
   * @param id 사용자 ID
   * @param board_id 게시판 ID
   * @returns
   */
  async findOneList(id: string, board_id: string) {
    const account_data = await this.findOneAccount({ id });
    // 구독중인 게시판 정보 조회 (구독 취소해도 게시글이 있는 경우 노출시켜줘야함)
    const subscribe_list = account_data.subscribe_list.filter((list) => list.id === board_id);

    // 아예 구독한적이 없는 경우
    if (subscribe_list.length === 0) {
      throw new BadRequestException('해당 페이지를 구독하고 있지 않습니다.');
    }
    const result = await this.sortList(subscribe_list);

    return result;
  }

  async sortList(subscribe_list: SubscribeListDto[]) {
    const result = await (await Promise.all(subscribe_list.map(async (list) => await this.boardService.getPostList(list)))).flat();

    if (!!result) {
      return result.sort((a, b) => {
        if (a.update_date > b.update_date) return -1;
        else return 1;
      });
    }
    return [];
  }

  async findAllAccount() {
    return await this.accountRepository.find();
  }
}
