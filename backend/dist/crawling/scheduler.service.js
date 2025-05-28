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
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crawling_service_1 = require("./crawling.service");
const schedule_1 = require("@nestjs/schedule");
let SchedulerService = class SchedulerService {
    crawlingService;
    prismaService;
    constructor(crawlingService, prismaService) {
        this.crawlingService = crawlingService;
        this.prismaService = prismaService;
    }
    async scheduleCrawling() {
        const today = new Date();
        console.log('scheduleCrawling', today);
        const currentDate = today.toISOString().split('T')[0];
        const formattedDate = currentDate.replace(/-/g, '');
        const gameData = await this.crawlingService.crawlerKboGameJson(formattedDate);
        console.log(formattedDate, gameData);
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "scheduleCrawling", null);
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crawling_service_1.CrawlingService,
        prisma_service_1.PrismaService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map