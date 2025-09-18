// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { IoAdapter } from '@nestjs/platform-socket.io';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:3001',
//     credentials: true 
//   });

//   // WebSocket
//   app.useWebSocketAdapter(new IoAdapter(app));

//   await app.listen(3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // libera pro Render ou pega de variável
    credentials: true,
  });

  // WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT || 3000; // Render injeta PORT
  await app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
