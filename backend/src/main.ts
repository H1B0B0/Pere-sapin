import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser (required for reading cookies)
  app.use(cookieParser());

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://frontend:3000',
      'http://localhost:3000',
      'http://frontend:3000',
    ],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5042;
  await app.listen(port);
  console.log(`Backend is running on port ${port}`);
}
bootstrap();
