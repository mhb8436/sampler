import { Module } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { CrawlingController } from './crawling.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [PrismaModule],
  controllers: [CrawlingController],
  providers: [CrawlingService, SchedulerService],
  exports: [CrawlingService],
})
export class CrawlingModule {}
