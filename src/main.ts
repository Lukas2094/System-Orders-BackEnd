import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // ===== Swagger =====
  const config = new DocumentBuilder()
    .setTitle('System Orders API')
    .setDescription('📘 Documentação da API Orders')
    .setVersion('1.0')
    .addBearerAuth() // JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // console.log('📘 Swagger disponível em: http://localhost:3000/api/docs');
  // ===================

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
