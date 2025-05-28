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
exports.AzureStorageInterceptor = void 0;
const common_1 = require("@nestjs/common");
const azure_storage_service_1 = require("./azure-storage.service");
let AzureStorageInterceptor = class AzureStorageInterceptor {
    azureStorageService;
    constructor(azureStorageService) {
        this.azureStorageService = azureStorageService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const files = request.files;
        console.log('AzureStorageInterceptor', files);
        if (files && files.length > 0) {
            const uploadedFiles = await this.azureStorageService.uploadFiles(files);
            console.log('AzureStorageInterceptor', uploadedFiles);
            request.files = uploadedFiles.map((file, index) => ({
                ...files[index],
                url: file.url,
            }));
        }
        return next.handle();
    }
};
exports.AzureStorageInterceptor = AzureStorageInterceptor;
exports.AzureStorageInterceptor = AzureStorageInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [azure_storage_service_1.AzureStorageService])
], AzureStorageInterceptor);
//# sourceMappingURL=azure-storage.interceptor.js.map