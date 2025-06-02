import { Injectable, OnModuleInit } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { Ollama } from '@langchain/ollama';
import { ConfigService } from '@nestjs/config';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class RecommendationsService implements OnModuleInit {
  private model: any;
  private chain: any;

  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly configService: ConfigService,
  ) {
    console.log('OLLAMA_BASE_URL:', this.configService.get('OLLAMA_BASE_URL'));
    console.log('DATABASE_URL:', this.configService.get('DATABASE_URL'));
  }

  async onModuleInit() {
    await this.initChain();
  }

  private async initChain() {
    try {
      this.model = this.createOllamaModel();

      const prompt = PromptTemplate.fromTemplate(`
        다음의 컨텍스트를 바탕으로 사용자의 질문에 답변해주세요:
        
        컨텍스트: {context}
        
        질문: {question}
        
        답변:
      `);
      this.chain = RunnableSequence.from([
        {
          context: async (input) => {
            const documents = await this.vectorStoreService.similaritySearch(
              input.question,
            );

            // Document 배열을 문자열로 변환
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
    } catch (error) {
      console.error('Error initializing chain:', error);
    }
  }

  private createOllamaModel(modelName: string = 'qwen2.5') {
    return new Ollama({
      baseUrl: 'http://localhost:11434', // 임시로 하드코딩
      model: modelName,
    });
  }

  async getRecommendation(query: string) {
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
    } catch (error) {
      console.error('Error in getRecommendation:', error);
      throw error;
    }
  }

  async addContent(content: string, metadata: Record<string, any>) {
    await this.vectorStoreService.addDocument([content], [metadata]);
  }
}
