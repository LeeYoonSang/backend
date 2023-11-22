import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    example: '홍길동',
    description: '이름',
  })
  name: string;

  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '이메일',
  })
  @IsEmail()
  email: string;

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

  @ApiProperty({
    example: 'student',
    description: '회원타입',
  })
  @IsIn(['student', 'admin'])
  type: 'student' | 'admin';
}

export class AccountDetailDto extends CreateAccountDto {
  @ApiProperty({
    description: '계정 ID',
  })
  id: string;
  @ApiProperty({
    description: '구독중인 학교 게시판 리스트',
  })
  subscribe_list: Array<SubscribeListDto> | null;
}

export class SubscribeListDto {
  @ApiProperty({
    description: '게시판 ID',
  })
  id: string;
  @ApiProperty({
    description: '구독 시작일(UTC)',
  })
  create_date: string;
  @ApiProperty({
    description: '구독 종료일(UTC)',
  })
  delete_date: string;
}
