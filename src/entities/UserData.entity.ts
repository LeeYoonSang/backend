import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubscribeListDto } from 'src/dto/account.Dto';

@Index('id_UNIQUE', ['id'], { unique: true })
@Entity('user_data', { schema: 'board' })
export class AccountEntity {
  @ApiProperty({
    description: '사용자 고유 ID',
  })
  @Column('varchar', { primary: true, name: 'id', length: 45 })
  id: string;

  @ApiProperty({
    description: '사용자 이메일',
  })
  @Column('varchar', { name: 'email', length: 60 })
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
  })
  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @ApiProperty({
    example: '서울초등학교',
    description: '사용자 소속 학교',
  })
  @Column('varchar', { name: 'school_name', length: 45 })
  school_name: string;

  @ApiProperty({
    example: 'student',
    description: '사용자 타입(student: 학생, admin: 관리자)',
  })
  @Column('varchar', { name: 'type', length: 45 })
  type: 'student' | 'admin';

  @ApiProperty({
    description: '구독중인 학교 게시판 리스트',
  })
  @Column('json', { name: 'subscribe_list', nullable: true })
  subscribe_list: Array<SubscribeListDto> | null;

  @ApiProperty({
    description: '지역',
  })
  @Column('varchar', { name: 'area', length: '45' })
  area: string;
}
