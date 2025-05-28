import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureStorageService {
  private readonly containerClient: ContainerClient;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    // console.log(
    //   'AzureStorageService constructor',
    //   this.escapeURLPath(connectionString),
    // );
    const containerName = this.configService.get(
      'AZURE_STORAGE_CONTAINER_NAME',
    );
    console.log(connectionString);
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  escapeURLPath(url: string): string {
    const urlParsed = new URL(url);

    let path = urlParsed.pathname;
    path = path || '/';

    path = escape(path);
    urlParsed.pathname = path;

    return urlParsed.toString();
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; fileName: string }> {
    const blobName = `${uuidv4()}-${file.originalname}`;
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    return {
      url: blockBlobClient.url,
      fileName: file.originalname,
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<{ url: string; fileName: string }[]> {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        return this.uploadFile(file);
      }),
    );
    return uploadedFiles;
  }

  async deleteFile(blobUrl: string): Promise<void> {
    const blobName = new URL(blobUrl).pathname.split('/').pop();
    if (!blobName) {
      throw new Error('Invalid blob URL');
    }
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    await blobClient.delete();
  }
}
