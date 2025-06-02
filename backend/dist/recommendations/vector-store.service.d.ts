import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class VectorStoreService implements OnModuleInit {
    private readonly configService;
    private vectorStore;
    private pool;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private initVectorStore;
    addDocument(texts: string[], metadata: Record<string, any>): Promise<void>;
    similaritySearch(query: string, k?: number): Promise<import("@langchain/core/documents").DocumentInterface<Record<string, any>>[]>;
}
