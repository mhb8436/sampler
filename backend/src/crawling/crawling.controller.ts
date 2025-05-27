import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { CreateCrawlingDto } from './dto/create-crawling.dto';
import { UpdateCrawlingDto } from './dto/update-crawling.dto';

@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  @Get('naver-news')
  async crawlNaverNews(@Query('url') url: string) {
    return this.crawlingService.crawlerNaverNews(url);
  }
  @Get('kbo-game-list')
  async crawlKboGameList(@Query('date') date: string): Promise<any> {
    return this.crawlingService.crawlerKboGameList(date);
  }

  @Get('kbo-game-json')
  async crawlKboGameJson(@Query('date') date: string): Promise<any> {
    return this.crawlingService.crawlerKboGameJson(date);
  }
}
