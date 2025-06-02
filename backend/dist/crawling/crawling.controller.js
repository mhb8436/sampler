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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlingController = void 0;
const common_1 = require("@nestjs/common");
const crawling_service_1 = require("./crawling.service");
let CrawlingController = class CrawlingController {
    crawlingService;
    constructor(crawlingService) {
        this.crawlingService = crawlingService;
    }
    async crawlNaverNews(url) {
        return this.crawlingService.crawlerNaverNews(url);
    }
    async crawlKboGameList(date) {
        return this.crawlingService.crawlerKboGameList(date);
    }
    async crawlKboGameJson(date) {
        return this.crawlingService.crawlerKboGameJson(date);
    }
    async crawlKboGameJsonStart() {
        return this.crawlingService.crawlerStartPither();
    }
};
exports.CrawlingController = CrawlingController;
__decorate([
    (0, common_1.Get)('naver-news'),
    __param(0, (0, common_1.Query)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrawlingController.prototype, "crawlNaverNews", null);
__decorate([
    (0, common_1.Get)('kbo-game-list'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrawlingController.prototype, "crawlKboGameList", null);
__decorate([
    (0, common_1.Get)('kbo-game-json'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrawlingController.prototype, "crawlKboGameJson", null);
__decorate([
    (0, common_1.Get)('kbo-game-pither'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrawlingController.prototype, "crawlKboGameJsonStart", null);
exports.CrawlingController = CrawlingController = __decorate([
    (0, common_1.Controller)('crawling'),
    __metadata("design:paramtypes", [crawling_service_1.CrawlingService])
], CrawlingController);
//# sourceMappingURL=crawling.controller.js.map