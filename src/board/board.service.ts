import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { BoardDto } from 'src/dto/boardDto';
import { BoardEntity } from 'src/entities/Board.entity';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  /**
   * 게시판 리스트 조회
   * @returns 게시판 리스트
   */
  async getBoardList() {
    const board = await this.boardRepository.find();
    return board;
  }
  /**
   * 게시판 생성
   * @param account_id 사용자 ID
   * @returns
   */
  async create(account_id: string) {
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const { school_name, type, area } = account_data;
    if (type !== 'admin') {
      throw new BadRequestException('학생은 게시판을 생성할 수 없습니다.');
    }

    const existedBoard = await this.findOneBoard({ school_name });

    if (existedBoard) {
      throw new BadRequestException('해당 학교는 이미 게시판이 존재합니다.');
    }

    const result = await this.boardRepository.save({
      school_name,
      area,
    });

    return result;
  }

  /**
   * 게시판 삭제
   * @param id 게시판 ID
   * @param account_id 사용자 ID
   * @returns
   */
  async delete(id: string, account_id: string) {
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const { school_name, type, area } = account_data;

    if (type !== 'admin') {
      throw new BadRequestException('학생은 게시판을 삭제할 수 없습니다.');
    }

    const existedBoard = await this.findOneBoard({ id, school_name, area });

    if (!existedBoard) {
      throw new BadRequestException('해당 학교는 삭제할 수 있는 게시판이 존재하지 않습니다.');
    }

    // 등록된 모든 게시글 삭제
    const post_list = existedBoard.post_list;
    await this.postService.deletePost(post_list, account_id);

    // 해당 페이지를 구독중인경우 구독리스트에서 제거해줘야함
    const all_account_data = await this.accountService.findAllAccount();
    const delete_subscribe_list = all_account_data
      .filter((account) => account.subscribe_list?.find((list) => list.id === id))
      .map((account) => {
        const { subscribe_list } = account;
        for (let i = 0; i < subscribe_list.length; i++) {
          if (subscribe_list[i].id === id) {
            subscribe_list.splice(i, 1);
            i--;
          }
        }
        return account;
      });
    Promise.all(delete_subscribe_list.map(async (account) => await this.accountService.update(account)));

    // 게시글 삭제 후 게시판도 삭제
    await this.boardRepository.delete({
      id: +id,
      school_name,
      area,
    });

    return {
      result: 'success',
      ststus: 200,
    };
  }

  /**
   * 게시판 내 게시글 조회
   * @param data 게시판 정보 (id: 게시판 id, create_date: 구독 시작일, delete_date: 구독 종료일)
   * @returns 게시글 정보 (업데이트 날짜 기준 최신순 정렬)
   */
  async getPostList(data: { id: string; create_date?: string; delete_date?: string }) {
    const board = await this.findOneBoard({ id: data.id });
    const post_id_list = board.post_list;

    if (!!post_id_list) {
      const result = (
        await this.postService.getPostDetail({ id: post_id_list, create_date: data.create_date, delete_date: data.delete_date })
      ).filter(Boolean);

      return !!result
        ? result.sort((a, b) => {
            if (a.update_date > b.update_date) return -1;
            else return 1;
          })
        : [];
    }
    return [];
  }

  /**
   * 특정 게시판 조회
   * @param data 게시판 정보
   * @returns 특정 게시판 정보
   */
  async findOneBoard(data: object) {
    const board = await this.boardRepository.findOne({
      where: {
        ...data,
      },
    });

    return board;
  }

  /**
   * 특정 게시판 업데이트
   * @param data 게시판 정보
   * @returns 업데이트된 게시판 정보
   */
  async update(data: BoardDto) {
    const result = await this.boardRepository.update(data.id, {
      post_list: data.post_list,
    });

    return result;
  }

  /**
   * 특정 게시판 구독 및 해지하기
   * @param id 게시판 ID
   * @param account_id 사용자ID
   * @returns
   */
  async subscribe(id: string, account_id: string) {
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const subscribe_list = account_data.subscribe_list;

    // 구독 리스트가 있는 경우
    if (subscribe_list) {
      // 이미 구독중인경우 구독 해제
      if (subscribe_list?.find((list) => list.id === id && !list.delete_date)) {
        const new_subscribe_list = subscribe_list.map((list) => {
          if (list.delete_date) {
            return list;
          }

          // 구독중인데 구독 해제일이 없는 경우 해제일 등록
          if (list.id === id) {
            const delete_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
            list.delete_date = delete_date;
            return list;
          }
          return list;
        });

        await this.accountService.update({ ...account_data, subscribe_list: new_subscribe_list });
      } else {
        // 해당페이지를 구독중이지 않은 경우 새로 구독
        const create_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        const subscribe_data = {
          id,
          create_date,
          delete_date: null,
        };
        await this.accountService.update({ ...account_data, subscribe_list: account_data.subscribe_list?.concat(subscribe_data) });
      }
    } else {
      // 구독중인 페이지가 없는 경우 새로 구독
      const create_date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
      const subscribe_data = {
        id,
        create_date,
        delete_date: null,
      };
      await this.accountService.update({ ...account_data, subscribe_list: [subscribe_data] });
    }
    return {
      status: 200,
    };
  }
}
