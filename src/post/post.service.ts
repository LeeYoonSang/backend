import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { BoardService } from 'src/board/board.service';
import { CreatePostDto } from 'src/dto/postDto';
import { PostEntity } from 'src/entities/PostData.entity';
import { Between, In, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
  ) {}

  /**
   * 특정 게시글 상세 조회
   * @param data 게시글 정보 (id: 게시글 ID, create_date: 게시글 생성일, delete_date: 구독 해제일(단순 조회시 필요 없음))
   * @returns 게시글 정보
   */
  async getPostDetail(data: { id: Array<string>; create_date?: string; delete_date?: string }) {
    const id_list = data.id.map((value) => +value);
    const start_date = data.create_date ? data.create_date : '1970-01-01 00:00:01';
    const end_date = data.delete_date ? data.delete_date : '2038-01-19 03:14:07';
    const post = await this.postRepository.find({
      where: {
        id: In(id_list),
        create_date: Between(start_date, end_date),
      },
    });

    return post;
  }

  /**
   * 게시글을 등록한다
   * @param body
   * @returns 등록된 게시글 정보
   */
  async createPost(body: CreatePostDto) {
    const account_id = body.account_id;
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const { type, school_name, name, area } = account_data;

    if (type !== 'admin') {
      throw new BadRequestException('학생인 경우 게시글을 작성할 수 없습니다.');
    }

    const board_data = await this.boardService.findOneBoard({ school_name });
    if (!board_data) {
      throw new BadRequestException('해당 학교는 게시판이 존재하지 않습니다.');
    }

    try {
      const result = await this.postRepository.save({
        title: body.title,
        detail: body.detail,
        author: name,
        school_name,
        author_id: account_id,
        area,
      });

      // 게시글 등록 후 게시글 리스트 업데이트
      await this.boardService.update({
        school_name,
        post_list: board_data.post_list ? board_data.post_list.concat(result.id.toString()) : [result.id.toString()],
        id: board_data.id,
        area,
      });

      return {
        id: result.id,
        ...result,
      };
    } catch {
      throw new BadRequestException('에러');
    }
  }

  /**
   * 특정 게시글을 삭제한다.
   * @param id 게시글 ID
   * @param account_id 사용자 ID
   * @returns
   */
  async deletePost(id: Array<string>, account_id: string) {
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const { type, school_name, area } = account_data;
    const delete_id_list = id?.map((value) => +value);

    if (type !== 'admin') {
      throw new BadRequestException('학생인 경우 게시글을 삭제할 수 없습니다.');
    }

    if (!!delete_id_list) {
      const delete_post = await this.postRepository.delete({
        id: In(delete_id_list),
      });
      const board_data = await this.boardService.findOneBoard({ school_name });

      await this.boardService.update({
        school_name,
        post_list: board_data.post_list?.filter((post) => !id.includes(post)),
        id: board_data.id,
        area,
      });

      return delete_post;
    }
    return {
      status: 200,
    };
  }

  /**
   * 특정 게시글을 업데이트 한다.
   * @param id 게시글 ID
   * @param body 게시글 정보
   * @returns
   */
  async updatePost(id: string, body: CreatePostDto) {
    const account_id = body.account_id;
    const account_data = await this.accountService.findOneAccount({ id: account_id });
    const { type } = account_data;

    if (type !== 'admin') {
      throw new BadRequestException('학생인 경우 게시글을 수정할 수 없습니다.');
    }

    await this.postRepository.update(id, {
      title: body.title,
      detail: body.detail,
    });

    return {
      status: 200,
      result: 'success',
    };
  }
}
