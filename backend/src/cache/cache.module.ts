import { Module } from "@nestjs/common";
import { CacheModule, CacheInterceptor } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as redisStore from "cache-manager-redis-store";
// import { APP_INTERCEPTOR } from "@nestjs/core";
// import * as redisStore from "cache-manager-ioredis";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get("REDIS_HOST"),
        port: configService.get("REDIS_PORT"),
        ttl: configService.get("CACHE_TTL"),
      }),
    }),
    ConfigModule,
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class CacheConfigModule {}
