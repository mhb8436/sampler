import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { CrawlingModule } from './crawling/crawling.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot({}),
    UsersModule,
    PostsModule,
    PrismaModule,
    ChatsModule,
    AuthModule,
    CrawlingModule,
    AzureStorageModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
