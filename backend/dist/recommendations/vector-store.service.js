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
exports.VectorStoreService = void 0;
const common_1 = require("@nestjs/common");
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
const pg_1 = require("pg");
const config_1 = require("@nestjs/config");
const ollama_1 = require("@langchain/ollama");
let VectorStoreService = class VectorStoreService {
    configService;
    vectorStore;
    pool;
    constructor(configService) {
        this.configService = configService;
        this.pool = new pg_1.Pool({
            connectionString: this.configService.get('DATABASE_URL'),
        });
    }
    async onModuleInit() {
        await this.initVectorStore();
    }
    async initVectorStore() {
        const embeddings = new ollama_1.OllamaEmbeddings({
            model: 'qwen2.5',
            baseUrl: this.configService.get('OLLAMA_BASE_URL'),
        });
        this.vectorStore = await pgvector_1.PGVectorStore.initialize(embeddings, {
            pool: this.pool,
            tableName: 'recommendations',
            columns: {
                idColumnName: 'id',
                vectorColumnName: 'embedding',
                contentColumnName: 'content',
                metadataColumnName: 'metadata',
            },
        });
    }
    async addDocument(texts, metadata) {
        await this.vectorStore.addDocuments(texts.map((text, i) => ({
            pageContent: text,
            metadata: metadata[i],
        })));
    }
    async similaritySearch(query, k = 5) {
        const results = await this.vectorStore.similaritySearch(query, k);
        return results;
    }
};
exports.VectorStoreService = VectorStoreService;
exports.VectorStoreService = VectorStoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VectorStoreService);
//# sourceMappingURL=vector-store.service.js.map