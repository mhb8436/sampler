import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AzureStorageService } from './azure-storage.service';
export declare class AzureStorageInterceptor implements NestInterceptor {
    private readonly azureStorageService;
    constructor(azureStorageService: AzureStorageService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
