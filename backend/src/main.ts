import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 전역 파이프 설정 (DTO 유효성 검사)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      transform: true, // 자동 타입 변환
    }),
  );

  // 전역 인터셉터 설정 (Exclude 데코레이터 적용)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get('Reflector')),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS 튜토리얼 API')
    .setDescription('Express 개발자를 위한 NestJS 학습 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS 설정
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Socket.IO를 위한 설정
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // PM2 ready 신호 전송
  if (process.send) {
    process.send('ready');
  }

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
