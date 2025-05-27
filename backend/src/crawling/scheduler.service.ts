import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrawlingService } from './crawling.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly crawlingService: CrawlingService,
    private readonly prismaService: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async scheduleCrawling() {
    const today = new Date();
    console.log('scheduleCrawling', today);
    const currentDate = today.toISOString().split('T')[0];
    // YYYY-MM-DD -> YYYYMMDD
    const formattedDate = currentDate.replace(/-/g, '');
    const gameData =
      await this.crawlingService.crawlerKboGameJson(formattedDate);

    console.log(formattedDate, gameData);

    // 데이터 저장 로직을 추가해주세요
  }
}
