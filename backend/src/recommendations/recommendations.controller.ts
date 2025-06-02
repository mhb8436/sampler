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
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  async addContent(
    @Body() body: { content: string; metadata: Record<string, any> },
  ) {
    await this.recommendationsService.addContent(body.content, body.metadata);
  }

  @Get()
  async getRecommendation(@Query('query') query: string) {
    console.log('getRecommendation', query);
    const result = await this.recommendationsService.getRecommendation(query);
    console.log('getRecommendation result', result);
    return result;
  }
}
