import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppModule } from './modules/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on: http://localhost:${port}`);
  console.log(`For mobile devices, use: http://${require('os').networkInterfaces()['en0']?.[1]?.address || 'YOUR_IP'}:${port}`);
}

bootstrap();
