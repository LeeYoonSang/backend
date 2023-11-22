import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('board', { schema: 'board' })
export class BoardEntity {
  @ApiProperty({
    example: 1,
    description: '게시판 번호',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '서울초등학교',
    description: '학교이름',
  })
  @Column('varchar', { name: 'school_name', length: 45 })
  school_name: string;

  @ApiProperty({
    description: '게시글 리스트',
  })
  @Column('json', { name: 'post_list' })
  post_list: Array<string> | null;

  @ApiProperty({
    description: '지역',
  })
  @Column('varchar', { name: 'area', length: '45' })
  area: string;
}
