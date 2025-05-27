import { PrismaService } from 'src/prisma/prisma.service';
import { CrawlingService } from './crawling.service';
export declare class SchedulerService {
    private readonly crawlingService;
    private readonly prismaService;
    constructor(crawlingService: CrawlingService, prismaService: PrismaService);
    scheduleCrawling(): Promise<void>;
}
