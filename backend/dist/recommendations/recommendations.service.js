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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const vector_store_service_1 = require("./vector-store.service");
const ollama_1 = require("@langchain/ollama");
const config_1 = require("@nestjs/config");
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
let RecommendationsService = class RecommendationsService {
    vectorStoreService;
    configService;
    model;
    chain;
    constructor(vectorStoreService, configService) {
        this.vectorStoreService = vectorStoreService;
        this.configService = configService;
        console.log('OLLAMA_BASE_URL:', this.configService.get('OLLAMA_BASE_URL'));
        console.log('DATABASE_URL:', this.configService.get('DATABASE_URL'));
    }
    async onModuleInit() {
        await this.initChain();
    }
    async initChain() {
        try {
            this.model = this.createOllamaModel();
            const prompt = prompts_1.PromptTemplate.fromTemplate(`
        다음의 컨텍스트를 바탕으로 사용자의 질문에 답변해주세요:
        
        컨텍스트: {context}
        
        질문: {question}
        
        답변:
      `);
            this.chain = runnables_1.RunnableSequence.from([
                {
                    context: async (input) => {
                        const documents = await this.vectorStoreService.similaritySearch(input.question);
                        const contextString = documents
                            .map((doc) => doc.pageContent)
                            .join('\n\n');
                        return contextString;
                    },
                    question: (input) => {
                        return input.question;
                    },
                },
                prompt,
                this.model,
            ]);
        }
        catch (error) {
            console.error('Error initializing chain:', error);
        }
    }
    createOllamaModel(modelName = 'qwen2.5') {
        return new ollama_1.Ollama({
            baseUrl: 'http://localhost:11434',
            model: modelName,
        });
    }
    async getRecommendation(query) {
        console.log('getRecommendation', query);
        console.log('Chain exists:', !!this.chain);
        if (!this.chain) {
            return 'Chain not initialized';
        }
        try {
            const result = await this.chain.invoke({
                question: query,
            });
            return result;
        }
        catch (error) {
            console.error('Error in getRecommendation:', error);
            throw error;
        }
    }
    async addContent(content, metadata) {
        await this.vectorStoreService.addDocument([content], [metadata]);
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vector_store_service_1.VectorStoreService,
        config_1.ConfigService])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map