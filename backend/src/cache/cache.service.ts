import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get(key);
      return value ? JSON.parse(value.toString()) : null;
    } catch (e) {
      console.error({ e });
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      return await this.cacheManager.set(key, value, ttl);
    } catch (e) {
      console.error({ e });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (e) {
      console.error({ e });
    }
  }
}
