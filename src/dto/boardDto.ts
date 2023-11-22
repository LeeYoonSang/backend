import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    description: '사용자 ID',
  })
  account_id?: string;
  @ApiProperty({
    example: '서울초등학교',
    description: '학교명',
  })
  school_name: string;
  @ApiProperty({
    example: '서울',
    description: '지역명',
  })
  area: string;
}

export class BoardDto extends CreateBoardDto {
  @ApiProperty({
    description: '게시글 리스트',
  })
  post_list: Array<string> | null;
  @ApiProperty({
    description: '게시판 ID',
  })
  id: number;
}
