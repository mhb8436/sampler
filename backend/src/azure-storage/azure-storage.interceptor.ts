import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AzureStorageService } from './azure-storage.service';

@Injectable()
export class AzureStorageInterceptor implements NestInterceptor {
  constructor(private readonly azureStorageService: AzureStorageService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;
    console.log('AzureStorageInterceptor', files);
    if (files && files.length > 0) {
      const uploadedFiles = await this.azureStorageService.uploadFiles(files);
      //   request.files = uploadedFiles;
      console.log('AzureStorageInterceptor', uploadedFiles);
      request.files = uploadedFiles.map((file, index) => ({
        ...files[index],
        url: file.url,
      }));
    }
    return next.handle();
  }
}
