import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: '제목',
    description: '게시글 제목',
  })
  title: string;
  @ApiProperty({
    example: '내용',
    description: '게시글 내용',
  })
  detail: string;
  @ApiProperty({
    description: '작성자 ID (계정 발급 시 사용한 UUID)',
  })
  account_id?: string;
  @ApiProperty({
    description: '게시글 ID',
  })
  id: number;
}

export class PostDetailDto extends CreatePostDto {
  @ApiProperty({
    description: '게시글 등록일',
  })
  create_date: string;
  @ApiProperty({
    description: '게시글 수정일',
  })
  update_date: string;
  @ApiProperty({
    description: '작성자 이름',
  })
  author?: string;
  @ApiProperty({
    description: '학교 이름',
  })
  school_name: string;
  @ApiProperty({
    description: '지역',
  })
  area: string;
}
