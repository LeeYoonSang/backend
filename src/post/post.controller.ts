import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePostDto, PostDetailDto } from 'src/dto/postDto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('게시글 API')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '게시글 상세정보 API', description: '게시글 상세 정보를 가져온다.' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiOkResponse({ description: '게시글 정보', type: PostDetailDto, isArray: true })
  async getPostDetail(@Param('id') id: string) {
    return this.postService.getPostDetail({ id: [id] });
  }

  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: '게시글 등록 API', description: '게시글을 등록한다' })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ description: '등록된 게시글 정보', type: PostDetailDto })
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @Post(':id/delete')
  @HttpCode(200)
  @ApiOperation({ summary: '게시글 삭제 API', description: '게시글을 삭제한다.' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiQuery({ name: 'account-id', required: true, description: '사용자 ID' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  async deletePost(@Param('id') id: string, @Query('account-id') account_id: string) {
    return this.postService.deletePost([id], account_id);
  }

  @Patch(':id/update')
  @HttpCode(200)
  @ApiOperation({ summary: '게시글 업데이트 API', description: '게시글을 업데이트한다. ' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiBody({ type: CreatePostDto })
  @ApiOkResponse({ description: '수정된 게시글 정보', type: PostDetailDto })
  @ApiBadRequestResponse({ description: '학생이 시도한 경우 실패한다.' })
  async updatePost(@Param('id') id: string, @Body() body: CreatePostDto) {
    return this.postService.updatePost(id, body);
  }
}
