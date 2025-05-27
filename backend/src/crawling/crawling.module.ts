import { Module } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { CrawlingController } from './crawling.controller';

@Module({
  controllers: [CrawlingController],
  providers: [CrawlingService],
})
export class CrawlingModule {}
