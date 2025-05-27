import { CrawlingService } from './crawling.service';
export declare class CrawlingController {
    private readonly crawlingService;
    constructor(crawlingService: CrawlingService);
    crawlNaverNews(url: string): Promise<{
        url: string;
        title: string;
        content: string;
        press: string;
        date: string;
        reporter: string;
        relatedNews: any[];
        crawledAt: Date;
    } | undefined>;
    crawlKboGameList(date: string): Promise<any>;
    crawlKboGameJson(date: string): Promise<any>;
}
