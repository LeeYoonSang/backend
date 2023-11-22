import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { BoardModule } from './board/board.module';
import * as path from 'path';

@Module({
  imports: [
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        logging: true,
        entities: [path.join(__dirname, 'src/entities/**/*.entitiy.ts'), path.join(__dirname, 'dist/entities/**/*.entity.js')],
        synchronize: false,
        keepConnectionAlive: true,
        autoLoadEntities: true,
        timezone: 'Z',
      }),
    }),
    PostModule,
    BoardModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
