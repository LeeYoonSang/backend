import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountDetailDto, CreateAccountDto } from 'src/dto/account.Dto';
import { BoardDto } from 'src/dto/boardDto';
import { PostDetailDto } from 'src/dto/postDto';
import { AccountService } from './account.service';

@Controller('account')
@ApiTags('회원 API')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('sign-up')
  @ApiOperation({ summary: '회원 생성 API', description: '회원을 생성한다' })
  @ApiCreatedResponse({ description: '회원을 생성한다', type: AccountDetailDto })
  async create(@Body() body: CreateAccountDto) {
    console.log('body', body);

    return this.accountService.create(body);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '회원 상세 정보 조회 API', description: '회원 정보를 조회한다' })
  @ApiOkResponse({ description: '회원 상세 정보', type: AccountDetailDto })
  @ApiParam({ description: '사용자 ID', name: 'id', required: true })
  async getAccountDetail(@Param('id') id: string) {
    return this.accountService.findOneAccount({ id });
  }

  @Get(':id/my-subscribe-list')
  @HttpCode(200)
  @ApiOperation({ summary: '구독중인 게시판 리스트 조회 API ', description: '구독중인 게시판 리스트를 보여준다.' })
  @ApiParam({ description: '사용자 ID', required: true, name: 'id' })
  @ApiOkResponse({ description: '구독하고 있는 페이지 리스트', type: BoardDto, isArray: true })
  async mySubscribeBoardList(@Param('id') id: string) {
    return this.accountService.getMySubscribeBoardList(id);
  }

  @Get(':id/my-subscribe-list/all')
  @HttpCode(200)
  @ApiOperation({
    summary: '구독중인 게시판에 있는 게시글 조회 API',
    description: '구독중인 게시판에 있는 게시글 리스트를 보여준다. (구독 기간에 있던 게시글만 보여준다.)',
  })
  @ApiParam({ description: '사용자 ID', name: 'id', required: true })
  @ApiOkResponse({
    description: '구독 중인 모든 학교 페이지에 있는 게시글(구독 기간 내에 등록된 글만 조회됨)',
    type: PostDetailDto,
    isArray: true,
  })
  async getMySubscribe(@Param('id') id: string) {
    return this.accountService.getMySubscribe(id);
  }

  @Get(':id/my-subscribe-list/detail')
  @HttpCode(200)
  @ApiOperation({
    summary: '구독중인 게시판 중 특정 게시판에 있는 게시글 리스트 조회 API',
    description: '구독중인 학교 게시판 중 특정 학교 게시글을 전부 가져온다. (구독 기간에 있던 게시글만 보여준다.)',
  })
  @ApiParam({ description: '사용자 ID', name: 'id', required: true })
  @ApiQuery({ description: '게시판 ID', name: 'board-id', required: true })
  @ApiOkResponse({ description: '해당 학교 페이지에 있는 게시글(구독 기간 내에 등록된 글만 조회됨)', type: PostDetailDto, isArray: true })
  async findOneList(@Param('id') id: string, @Query('board-id') board_id: string) {
    return this.accountService.findOneList(id, board_id);
  }
}
