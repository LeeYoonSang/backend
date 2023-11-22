import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('post_data', { schema: 'board' })
export class PostEntity {
  @ApiProperty({
    example: 1,
    description: '게시글 번호',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '제목',
    description: '게시글 제목',
  })
  @Column('varchar', { name: 'title', length: 45 })
  title: string;

  @ApiProperty({
    example: '내용',
    description: '게시글 내용',
  })
  @Column('varchar', { name: 'detail', length: 4000 })
  detail: string;

  @ApiProperty({
    example: '2023-11-10 15:24:34',
    description: '게시글 생성일(UTC)',
  })
  @CreateDateColumn({ name: 'create_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(2)' })
  create_date: string;

  @ApiProperty({
    example: '2023-11-10 15:44:35',
    description: '게시글 수정일(UTC)',
  })
  @UpdateDateColumn({ name: 'update_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(2)' })
  update_date: string | null;

  @ApiProperty({
    example: '홍길동',
    description: '게시글 작성자',
  })
  @Column('varchar', { name: 'author', length: 45 })
  author: string;

  @ApiProperty({
    description: '작성자 ID',
  })
  @Column('varchar', { name: 'author_id', length: 45 })
  author_id: string;

  @ApiProperty({
    example: '서울초등학교',
    description: '학교이름',
  })
  @Column('varchar', { name: 'school_name', length: 45 })
  school_name: string;

  @ApiProperty({
    description: '지역',
  })
  @Column('varchar', { name: 'area', length: '45' })
  area: string;
}
