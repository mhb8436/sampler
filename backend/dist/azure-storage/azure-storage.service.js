"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorageService = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let AzureStorageService = class AzureStorageService {
    configService;
    containerClient;
    constructor(configService) {
        this.configService = configService;
        const connectionString = this.configService.get('AZURE_STORAGE_CONNECTION_STRING');
        const containerName = this.configService.get('AZURE_STORAGE_CONTAINER_NAME');
        console.log(connectionString);
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = blobServiceClient.getContainerClient(containerName);
    }
    escapeURLPath(url) {
        const urlParsed = new URL(url);
        let path = urlParsed.pathname;
        path = path || '/';
        path = escape(path);
        urlParsed.pathname = path;
        return urlParsed.toString();
    }
    async uploadFile(file) {
        const blobName = `${(0, uuid_1.v4)()}-${file.originalname}`;
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
    async uploadFiles(files) {
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            return this.uploadFile(file);
        }));
        return uploadedFiles;
    }
    async deleteFile(blobUrl) {
        const blobName = new URL(blobUrl).pathname.split('/').pop();
        if (!blobName) {
            throw new Error('Invalid blob URL');
        }
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        await blobClient.delete();
    }
};
exports.AzureStorageService = AzureStorageService;
exports.AzureStorageService = AzureStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AzureStorageService);
//# sourceMappingURL=azure-storage.service.js.map