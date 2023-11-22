import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BoardDto } from 'src/dto/boardDto';
import { PostDetailDto } from 'src/dto/postDto';
import { BoardService } from './board.service';

@Controller('board')
@ApiTags('게시판 API')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '게시판 리스트 API', description: '모든 학교 게시판정보를 조회한다.' })
  @ApiOkResponse({ description: '모든 학교 페이지 리스트', type: BoardDto, isArray: true })
  async getBoardList() {
    return this.boardService.getBoardList();
  }

  @Post('create')
  @ApiQuery({ name: 'account-id', description: '사용자 ID' })
  @ApiOperation({ summary: '게시판 등록 API', description: '해당 학교 게시판을 새로 개설한다.(관리자만 가능)' })
  @ApiCreatedResponse({ description: '등록된 게시판 정보', type: BoardDto })
  @ApiBadRequestResponse({ description: '이미 게시판이 존재하거나 학생이 시도하는 경우 발생' })
  async create(@Query('account-id') account_id: string) {
    return this.boardService.create(account_id);
  }

  @Post(':id/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '게시판 삭제 API', description: '해당 학교 게시판을 삭제한다.(관리자만 가능)' })
  @ApiParam({ name: 'id', description: '게시판 ID', required: true })
  @ApiQuery({ name: 'account-id', description: '사용자 ID' })
  @ApiOkResponse({ description: '게시판 삭제 완료 (게시판에 남아있던 게시글도 전부 삭제된다)' })
  @ApiBadRequestResponse({ description: '이미 게시판이 삭제되었거나 학생이 시도하는 경우 발생' })
  async delete(@Param('id') id: string, @Query('account-id') account_id: string) {
    return this.boardService.delete(id, account_id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '게시판 상세 조회 API', description: '해당 학교 게시판에 있는 게시글 리스트를 조회한다.' })
  @ApiParam({ name: 'id', description: '게시판 ID', required: true })
  @ApiOkResponse({ description: '게시판 내 게시글 리스트', type: PostDetailDto, isArray: true })
  async getPostList(@Param('id') id: string) {
    return this.boardService.getPostList({ id });
  }

  @Post(':id/subscribe')
  @HttpCode(200)
  @ApiOperation({ summary: '게시판 구독 및 해제 API', description: '해당 학교 게시판을 구독한다.' })
  @ApiParam({ name: 'id', description: '게시판 ID', required: true })
  @ApiQuery({ name: 'account-id', description: '사용자 ID' })
  @ApiOkResponse({ description: '구독 설정 및 해제 완료' })
  async subscribe(@Param('id') id: string, @Query('account-id') account_id: string) {
    return this.boardService.subscribe(id, account_id);
  }
}
