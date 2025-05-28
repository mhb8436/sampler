import { Test, TestingModule } from '@nestjs/testing';
import { AzureStorageService } from './azure-storage.service';

describe('AzureStorageService', () => {
  let service: AzureStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureStorageService],
    }).compile();

    service = module.get<AzureStorageService>(AzureStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
