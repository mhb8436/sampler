import { Injectable, OnModuleInit } from '@nestjs/common';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { OllamaEmbeddings } from '@langchain/ollama';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private vectorStore: PGVectorStore;
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.get('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    await this.initVectorStore();
  }

  private async initVectorStore() {
    const embeddings = new OllamaEmbeddings({
      model: 'qwen2.5',
      baseUrl: this.configService.get('OLLAMA_BASE_URL'),
    });

    this.vectorStore = await PGVectorStore.initialize(embeddings, {
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

  async addDocument(texts: string[], metadata: Record<string, any>) {
    await this.vectorStore.addDocuments(
      texts.map((text, i) => ({
        pageContent: text,
        metadata: metadata[i],
      })),
    );
  }

  async similaritySearch(query: string, k: number = 5) {
    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }
}
