import { Global, Module } from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AzureStorageService],
  exports: [AzureStorageService],
})
export class AzureStorageModule {}
