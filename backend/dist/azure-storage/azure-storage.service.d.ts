import { ConfigService } from '@nestjs/config';
export declare class AzureStorageService {
    private readonly configService;
    private readonly containerClient;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        fileName: string;
    }>;
    uploadFiles(files: Express.Multer.File[]): Promise<{
        url: string;
        fileName: string;
    }[]>;
    deleteFile(blobUrl: string): Promise<void>;
}
