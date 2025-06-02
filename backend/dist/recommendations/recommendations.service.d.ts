import { OnModuleInit } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { ConfigService } from '@nestjs/config';
export declare class RecommendationsService implements OnModuleInit {
    private readonly vectorStoreService;
    private readonly configService;
    private model;
    private chain;
    constructor(vectorStoreService: VectorStoreService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private initChain;
    private createOllamaModel;
    getRecommendation(query: string): Promise<any>;
    addContent(content: string, metadata: Record<string, any>): Promise<void>;
}
