import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { BoardModule } from 'src/board/board.module';
import { BoardService } from 'src/board/board.service';
import { BoardEntity } from 'src/entities/Board.entity';
import { PostEntity } from 'src/entities/PostData.entity';
import { AccountEntity } from 'src/entities/UserData.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, AccountEntity, BoardEntity]), forwardRef(() => AccountModule), forwardRef(() => BoardModule)],
  providers: [PostService, AccountService, BoardService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
