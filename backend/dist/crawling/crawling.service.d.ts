interface KboGameData {
    snm: string;
    simage: string | undefined;
    gtm: string;
    broadcating: string;
    status: string;
}
export declare class CrawlingService {
    headers: {
        'User-Agent': string;
    };
    crawlerNaverNews(url: string): Promise<{
        url: string;
        title: string;
        content: string;
        press: string;
        date: string;
        reporter: string;
        relatedNews: any[];
        crawledAt: Date;
    } | undefined>;
    crawlerKboGameList(date: string): Promise<KboGameData[]>;
    crawlerKboGameJson(date: string): Promise<any>;
}
export {};
