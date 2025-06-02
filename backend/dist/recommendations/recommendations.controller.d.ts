import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    addContent(body: {
        content: string;
        metadata: Record<string, any>;
    }): Promise<void>;
    getRecommendation(query: string): Promise<any>;
}
