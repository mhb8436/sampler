import { Test, TestingModule } from '@nestjs/testing';
import { CrawlingService } from './crawling.service';

describe('CrawlingService', () => {
  let service: CrawlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlingService],
    }).compile();

    service = module.get<CrawlingService>(CrawlingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
