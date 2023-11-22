import { Module, forwardRef } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { AccountService } from 'src/account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from 'src/entities/Board.entity';
import { AccountModule } from 'src/account/account.module';
import { AccountEntity } from 'src/entities/UserData.entity';
import { PostService } from 'src/post/post.service';
import { PostModule } from 'src/post/post.module';
import { PostEntity } from 'src/entities/PostData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, AccountEntity, PostEntity]), forwardRef(() => AccountModule), forwardRef(() => PostModule)],
  providers: [BoardService, AccountService, PostService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
