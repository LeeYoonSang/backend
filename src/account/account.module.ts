import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/UserData.entity';
import { PostService } from 'src/post/post.service';
import { BoardService } from 'src/board/board.service';
import { PostEntity } from 'src/entities/PostData.entity';
import { BoardEntity } from 'src/entities/Board.entity';
import { BoardModule } from 'src/board/board.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, PostEntity, BoardEntity]), forwardRef(() => BoardModule), forwardRef(() => PostModule)],
  providers: [AccountService, PostService, BoardService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
