import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { VectorStoreService } from './vector-store.service';

@Module({
  controllers: [RecommendationsController],
  providers: [RecommendationsService, VectorStoreService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
